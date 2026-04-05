'use client';

import { useState } from 'react';
// 1. We imported useGetUsers here!
import { useGetTickets, useGetUsers } from '@/hooks/useTickets'; 
import { formatDistanceToNow } from 'date-fns';
import { Ticket as TicketIcon, PlusCircle, AlertCircle, Loader2, Filter, Search, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

export default function TicketDashboard() {
  const { data: tickets, isLoading, isError } = useGetTickets();
  const { data: users } = useGetUsers(); // 2. Fetch the users to map IDs to Names

  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTickets = tickets?.filter((ticket) => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const totalPages = filteredTickets ? Math.ceil(filteredTickets.length / itemsPerPage) : 0;
  const paginatedTickets = filteredTickets?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  
 
  // Helper to find a user's name
  const getAssignedUser = (userId: number | null) => {
    if (!userId) return null;
    return users?.find(u => u.id === userId);
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
  if (isError) return <div className="flex h-screen items-center justify-center text-red-500"><AlertCircle className="mr-2 h-6 w-6" /><p>Failed to load tickets.</p></div>;

  return (
    <div className="mx-auto max-w-6xl p-6 overflow-x-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <TicketIcon className="h-8 w-8 text-blue-600" /> Zeto Ticket Desk
          </h1>
          <p className="text-gray-500 mt-1">Manage and track internal support requests.</p>
        </div>
        <Link href="/create" className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors">
          <PlusCircle className="h-5 w-5" /> New Ticket
        </Link>
      </header>

      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by ticket title..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="block w-full rounded-md border border-gray-300 py-1.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
          <Filter className="h-4 w-4 text-gray-400 hidden sm:block" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }} className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ticket</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedTickets?.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No tickets found.</td></tr>
            ) : (
              paginatedTickets?.map((ticket) => {
                const assignedUser = getAssignedUser(ticket.assignedToUserId);
                
                return (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{ticket.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${ticket.status === 'open' ? 'bg-green-100 text-green-800' : ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 capitalize">{ticket.priority}</td>
                    
                    {/* 4. The New Assigned To Column! */}
                    <td className="whitespace-nowrap px-6 py-4">
                      {assignedUser ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                            {assignedUser.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{assignedUser.name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          <UserIcon className="h-4 w-4" />
                          <span className="text-sm italic">Unassigned</span>
                        </div>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link href={`/ticket/${ticket.id}`} className="text-blue-600 hover:text-blue-900">View Details</Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-3">
            <span className="text-sm text-gray-700">
              Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Prev
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}