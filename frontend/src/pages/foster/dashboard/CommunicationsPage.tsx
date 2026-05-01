import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Msg { id: string; from: string; subject: string; preview: string; time: string; unread: boolean; }

const initialMessages: Msg[] = [
  { id: "1", from: "Sarah Miller", subject: "Case Update - Emma Johnson", preview: "The latest home visit went well. Emma seems to be adjusting nicely...", time: "10:30 AM", unread: true },
  { id: "2", from: "John Davis", subject: "Foster Family Review", preview: "The Anderson family certification is due for renewal next month...", time: "9:15 AM", unread: true },
  { id: "3", from: "Maria Garcia", subject: "Urgent: Risk Alert", preview: "Please review the latest risk assessment for Olivia Brown...", time: "Yesterday", unread: false },
  { id: "4", from: "System", subject: "Weekly Report Ready", preview: "Your weekly placement report is ready for download...", time: "Yesterday", unread: false },
];

export default function CommunicationsPage() {
  const [messages] = useState(initialMessages);
  const [composeOpen, setComposeOpen] = useState(false);
  const [tab, setTab] = useState("Inbox");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const { toast } = useToast();

  const handleSend = () => {
    if (!to || !subject || !body) { toast({ variant: "destructive", title: "All fields required" }); return; }
    toast({ title: "Message sent" });
    setComposeOpen(false);
    setTo(""); setSubject(""); setBody("");
  };

  return (
    <div>
      <PageHeader title="Communications" description="Internal messaging system" actions={<Button onClick={() => setComposeOpen(true)} size="sm"><Send className="h-4 w-4 mr-1" /> Compose</Button>} />
      <div className="p-6">
        <div className="flex gap-2 mb-4">
          {["Inbox", "Sent", "Drafts"].map(t => (
            <Button key={t} variant={tab === t ? "default" : "outline"} size="sm" onClick={() => setTab(t)}>{t}</Button>
          ))}
        </div>
        <Card>
          <CardContent className="p-0 divide-y">
            {messages.map(msg => (
              <div key={msg.id} className={`p-4 flex items-center gap-4 hover:bg-muted/50 cursor-pointer transition-colors ${msg.unread ? "bg-primary/5" : ""}`}>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">{msg.from[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className={`text-sm ${msg.unread ? "font-semibold" : ""}`}>{msg.from}</span>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm truncate">{msg.subject}</p>
                  <p className="text-xs text-muted-foreground truncate">{msg.preview}</p>
                </div>
                {msg.unread && <div className="w-2 h-2 bg-primary rounded-full shrink-0" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Message</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>To</Label><Input value={to} onChange={e => setTo(e.target.value)} placeholder="Recipient name or email" /></div>
            <div className="space-y-2"><Label>Subject</Label><Input value={subject} onChange={e => setSubject(e.target.value)} /></div>
            <div className="space-y-2"><Label>Message</Label><Textarea value={body} onChange={e => setBody(e.target.value)} rows={5} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>Cancel</Button>
            <Button onClick={handleSend}><Send className="h-4 w-4 mr-1" /> Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
