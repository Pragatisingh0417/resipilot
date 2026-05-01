import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [orgName, setOrgName] = useState("ResiPilot Organization");
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [matchNotifs, setMatchNotifs] = useState(true);

  const handleSave = () => toast({ title: "Settings saved" });

  return (
    <div>
      <PageHeader title="Settings" description="Configure your application" />
      <div className="p-6 space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle className="text-base">Organization</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Organization Name</Label><Input value={orgName} onChange={e => setOrgName(e.target.value)} /></div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><Label>Email Notifications</Label><p className="text-xs text-muted-foreground">Receive updates via email</p></div>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Risk Alerts</Label><p className="text-xs text-muted-foreground">Get notified on risk level changes</p></div>
              <Switch checked={riskAlerts} onCheckedChange={setRiskAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Match Notifications</Label><p className="text-xs text-muted-foreground">AI matching result notifications</p></div>
              <Switch checked={matchNotifs} onCheckedChange={setMatchNotifs} />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
