import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThreadList from '../components/messages/ThreadList';
import ChatWindow from '../components/messages/ChatWindow';

export default function Messages() {
  const qc = useQueryClient();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [mobileShowThread, setMobileShowThread] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  const { data: threads = [] } = useQuery({
    queryKey: ['message-threads'],
    queryFn: () => base44.entities.MessageThread.list('-lastMessageAt', 100),
    enabled: !!currentUser,
  });

  // Real-time thread updates
  useEffect(() => {
    const unsub = base44.entities.MessageThread.subscribe(() => {
      qc.invalidateQueries({ queryKey: ['message-threads'] });
    });
    return unsub;
  }, [qc]);

  const selectedThread = threads.find(t => t.id === selectedThreadId);

  const handleSelect = (id) => {
    setSelectedThreadId(id);
    setMobileShowThread(true);
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-background flex overflow-hidden">
      {/* Thread list — hidden on mobile when thread is open */}
      <div className={`${mobileShowThread ? 'hidden md:flex' : 'flex'} md:flex flex-col h-full`}>
        <ThreadList
          threads={threads}
          selectedId={selectedThreadId}
          onSelect={handleSelect}
          currentUser={currentUser}
        />
      </div>

      {/* Chat window */}
      <div className={`${mobileShowThread ? 'flex' : 'hidden md:flex'} flex-1 flex-col h-full min-w-0`}>
        {selectedThread ? (
          <>
            {/* Mobile back button */}
            <div className="md:hidden px-4 pt-3 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => setMobileShowThread(false)}
                className="text-muted-foreground hover:text-foreground gap-1.5 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" /> All Messages
              </Button>
            </div>
            <ChatWindow thread={selectedThread} currentUser={currentUser} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center text-muted-foreground">
              <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 opacity-30" />
              </div>
              <p className="font-bold text-muted-foreground">Select a conversation</p>
              <p className="text-sm mt-1 text-muted-foreground">Or start a new one by clicking <span className="text-primary">+ New</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}