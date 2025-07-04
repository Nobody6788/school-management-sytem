import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Panel</CardTitle>
        <CardDescription>
          Manage all aspects of the CampusFlow application from here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Welcome to the admin panel. More management features will be added here soon.</p>
      </CardContent>
    </Card>
  );
}
