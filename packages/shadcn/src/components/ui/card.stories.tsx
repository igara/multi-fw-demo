import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm">New comment on your post</div>
          <div className="text-sm">Your report is ready</div>
          <div className="text-sm">System update available</div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Invite your team members to collaborate.</CardDescription>
        <CardAction>
          <Button size="sm">Invite</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm">John Doe</div>
            <div className="text-xs text-muted-foreground">Admin</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">Jane Smith</div>
            <div className="text-xs text-muted-foreground">Member</div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Choose a name and framework for your project. We'll deploy it for you.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button className="flex-1">Deploy</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithBorder: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader className="border-b">
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 py-4">
          <div className="text-sm">Profile settings</div>
          <div className="text-sm">Privacy settings</div>
          <div className="text-sm">Notification settings</div>
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent>
        <div className="space-y-2">
          <h3 className="font-semibold">Quick Note</h3>
          <p className="text-sm text-muted-foreground">
            This is a simple card with only content, no header or footer.
          </p>
        </div>
      </CardContent>
    </Card>
  ),
};
