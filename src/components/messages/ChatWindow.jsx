import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Paperclip, FileText, X, Image, File } from 'lucide-react';
import { toast } from 'sonner';
import CommissionPanel from './CommissionPanel';

export default function ChatWindow({ thread, currentUser }) {
  const qc = useQueryClient();
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const [text, setText] = useState('');
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showCommission, setShowCommission] = useState(false);

  const { data: messages = [] } = useQuery({
    queryKey: ['thread-messages', thread.id],
    queryFn: () => base44.entities.Message.filter({ threadId: thread.id }, 'created_date', 200),
    enabled: !!thread.id,
  });

  // Real-time message subscription
  useEffect(() => {
    const unsub = base44.entities.Message.subscribe((event) => {
      if (event.data?.threadId === thread.id) {
        qc.invalidateQueries({ queryKey: ['thread-messages', thread.id] });
      }
    });
    return unsub;
  }, [thread.id, qc]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const sendMutation = useMutation({
    mutationFn: async ({ content, fileUrls, fileNames }) => {
      await base44.entities.Message.create({
        threadId: thread.id,
        senderEmail: currentUser?.email,
        senderName: currentUser?.full_name || currentUser?.email,
        content,
        fileUrls,
        fileNames,
        messageType: 'text',
        read: false,
      });
      await base44.entities.MessageThread.update(thread.id, {
        lastMessage: content || '📎 Attachment',
        lastMessageAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['thread-messages', thread.id] });
      qc.invalidateQueries({ queryKey: ['message-threads'] });
      setText('');
      setPendingFiles([]);
    },
  });

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const { file_url } = await base44.integrations.Core.UploadFile({ file });
          return { url: file_url, name: file.name, type: file.type };
        })
      );
      setPendingFiles(prev => [...prev, ...uploaded]);
    } catch {
      toast.error('Upload failed');
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleSend = () => {
    if (!text.trim() && pendingFiles.length === 0) return;
    sendMutation.mutate({
      content: text.trim() || (pendingFiles.length > 0 ? '📎 Shared files' : ''),
      fileUrls: pendingFiles.map(f => f.url),
      fileNames: pendingFiles.map(f => f.name),
    });
  };

  const isCommissionActive = ['commission_pending', 'commission_accepted', 'commission_rejected'].includes(thread.status);
  const isMe = (email) => email === currentUser?.email;

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-border bg-card/80 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-foreground">{thread.subject}</h3>
          <p className="text-xs text-muted-foreground">
            {thread.artisanName} ↔ {thread.buyerName || thread.buyerEmail}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {thread.status === 'commission_pending' && (
            <Badge className="text-xs bg-amber-900/40 text-amber-300 border border-amber-700/50">⚡ Commission Pending</Badge>
          )}
          {thread.status === 'commission_accepted' && (
            <Badge className="text-xs bg-green-900/40 text-green-300 border border-green-700/50">✓ Commissioned</Badge>
          )}
          <Button size="sm" onClick={() => setShowCommission(true)}
            className={`gap-1.5 text-xs h-8 px-3 ${isCommissionActive ? 'bg-amber-700 hover:bg-amber-600 text-foreground' : 'bg-muted hover:bg-muted text-primary border border-primary/30'}`}>
            <FileText className="w-3.5 h-3.5" />
            {thread.status === 'commission_accepted' ? 'View Agreement' : thread.status === 'commission_pending' ? 'View Request' : 'Commission'}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => {
          const mine = isMe(msg.senderEmail);
          const isSystem = ['system', 'commission_request', 'commission_accepted', 'commission_rejected'].includes(msg.messageType);

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className={`px-4 py-2 rounded-full text-xs font-medium border max-w-xs text-center ${
                  msg.messageType === 'commission_accepted' ? 'bg-green-900/30 border-green-700/50 text-green-300' :
                  msg.messageType === 'commission_rejected' ? 'bg-red-900/30 border-red-700/50 text-red-300' :
                  msg.messageType === 'commission_request' ? 'bg-amber-900/30 border-amber-700/50 text-amber-300' :
                  'bg-muted border-border text-muted-foreground'
                }`}>{msg.content}</div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex gap-2.5 ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-1 bg-muted text-muted-foreground">
                {(msg.senderName || msg.senderEmail)?.[0]?.toUpperCase()}
              </div>
              <div className={`max-w-[70%] space-y-1.5 ${mine ? 'items-end' : 'items-start'} flex flex-col`}>
                {/* Files */}
                {msg.fileUrls?.length > 0 && (
                  <div className={`flex flex-wrap gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
                    {msg.fileUrls.map((url, i) => {
                      const name = msg.fileNames?.[i] || 'attachment';
                      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                      return isImage ? (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt={name} className="max-w-[200px] max-h-[160px] rounded-xl object-cover border border-border hover:opacity-90 transition-opacity" />
                        </a>
                      ) : (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-muted border border-border rounded-xl px-3 py-2 text-xs text-primary hover:border-primary transition-colors">
                          <File className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[120px]">{name}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
                {/* Text */}
                {msg.content && !(msg.fileUrls?.length > 0 && msg.content === '📎 Shared files') && (
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    mine ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm border border-border'
                  }`}>{msg.content}</div>
                )}
                <p className="text-xs text-muted-foreground px-1">
                  {new Date(msg.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Pending files preview */}
      {pendingFiles.length > 0 && (
        <div className="px-4 py-2 border-t border-border flex flex-wrap gap-2">
          {pendingFiles.map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-muted border border-border rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground">
              {f.type?.startsWith('image/') ? <Image className="w-3.5 h-3.5 text-primary" /> : <File className="w-3.5 h-3.5 text-primary" />}
              <span className="truncate max-w-[100px]">{f.name}</span>
              <button onClick={() => setPendingFiles(p => p.filter((_, j) => j !== i))}>
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 p-4 border-t border-border bg-card/50">
        <div className="flex items-end gap-2">
          <input type="file" ref={fileInputRef} multiple onChange={handleFileSelect} className="hidden" accept="image/*,.pdf,.doc,.docx" />
          <Button size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="text-muted-foreground hover:text-primary h-9 w-9 shrink-0">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
          </Button>
          <textarea value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type a message... (Enter to send)"
            rows={1} style={{ resize: 'none' }}
            className="flex-1 bg-muted border border-border text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary min-h-[40px] max-h-32" />
          <Button size="icon" onClick={handleSend} disabled={(!text.trim() && pendingFiles.length === 0) || sendMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 w-9 shrink-0">
            {sendMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <CommissionPanel open={showCommission} onClose={() => setShowCommission(false)}
        thread={thread} currentUser={currentUser}
        onMessageSent={() => qc.invalidateQueries({ queryKey: ['thread-messages', thread.id] })} />
    </div>
  );
}