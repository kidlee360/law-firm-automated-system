import { getAttorneyDashboardData } from '@/lib/supabase/queries';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Scale, Clock, AlertCircle, FileText } from "lucide-react";

export default async function AttorneyDashboard() {
  const cases = await getAttorneyDashboardData();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Case Management</h1>
          <p className="text-slate-500">New York Matrimonial Division</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
          + New Divorce Case
        </button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Active Cases" value={cases.length} icon={<Scale className="h-4 w-4" />} />
        <StatCard title="Pending Service" value="3" icon={<Clock className="h-4 w-4" />} color="text-amber-600" />
        <StatCard title="Urgent Deadlines" value="1" icon={<AlertCircle className="h-4 w-4" />} color="text-red-600" />
        <StatCard title="Files to Review" value="12" icon={<FileText className="h-4 w-4" />} />
      </div>

      {/* Case Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Client / Matter</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Grounds</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Next Deadline</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cases.map((c) => {
              const client = c.parties?.find(p => p.is_client);
              const nextDeadline = c.deadlines?.find(d => !d.completed);
              
              return (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{client?.first_name} {client?.last_name}</div>
                    <div className="text-xs text-slate-400 font-mono uppercase">{c.case_number || 'UNASSIGNED'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{c.grounds}</td>
                  <td className="px-6 py-4 text-sm">
                    {nextDeadline ? (
                      <span className="text-amber-700 font-medium">{nextDeadline.title} ({nextDeadline.due_date})</span>
                    ) : (
                      <span className="text-slate-400">No pending tasks</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-medium text-slate-900 hover:underline">View File</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color = "text-slate-600" }: any) {
  return (
    <Card className="shadow-none border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
        <div className={color}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}