'use client';

import { useState } from 'react';
import { useGetTickets } from '@/hooks/useTickets';
import { formatDistanceToNow } from 'date-fns';
import { Ticket as TicketIcon, PlusCircle, AlertCircle, Loader2, Filter } from 'lucide-react';
import Link from 'next/link';

export default function TicketDashboard() {
  const { data: tickets, isLoading, isError } = useGetTickets();

  // 1. Setup State for our filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // 2. Derive the filtered data dynamically
  const filteredTickets = tickets?.filter((ticket) => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        <AlertCircle className="mr-2 h-6 w-6" />
        <p>Failed to load tickets. Is the backend running?</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <TicketIcon className="h-8 w-8 text-blue-600" />
            Zeto Ticket Desk
          </h1>
          <p className="text-gray-500 mt-1">Manage and track internal support requests.</p>
        </div>
        
        <Link 
          href="/create" 
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          New Ticket
        </Link>
      </header>

      {/* FILTER BAR */}
      <div className="mb-6 flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center text-gray-500">
          <Filter className="mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ticket</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {/* 3. Render filteredTickets instead of the raw tickets array */}
            {filteredTickets?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No tickets found matching your filters.
                </td>
              </tr>
            ) : (
              filteredTickets?.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-gray-900">{ticket.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                      ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <span className={`capitalize ${
                      ticket.priority === 'high' ? 'text-red-600 font-medium' :
                      ticket.priority === 'medium' ? 'text-orange-500' : 'text-gray-500'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link href={`/ticket/${ticket.id}`} className="text-blue-600 hover:text-blue-900">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}