"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Cài đặt</h1>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Tên trang web</Label>
              <Input id="site-name" defaultValue="E-Learning Platform" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-description">Mô tả trang web</Label>
              <Input
                id="site-description"
                defaultValue="Nền tảng học trực tuyến"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance-mode">Chế độ bảo trì</Label>
              <Switch id="maintenance-mode" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cài đặt email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" type="text" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-user">SMTP Username</Label>
              <Input id="smtp-user" type="text" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password">SMTP Password</Label>
              <Input id="smtp-password" type="password" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button>Lưu thay đổi</Button>
      </div>
    </div>
  );
}
