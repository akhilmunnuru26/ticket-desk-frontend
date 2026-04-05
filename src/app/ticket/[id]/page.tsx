'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Loader2, MessageSquare, User as UserIcon } from 'lucide-react';
import { 
  useGetTicketById, 
  useGetTicketComments, 
  useGetUsers, 
  useUpdateTicket, 
  useCreateComment 
} from '@/hooks/useTickets';

export default function TicketDetailsPage() {
  const params = useParams();
  const ticketId = Number(params.id); // Grab the ID from the URL: /ticket/1 -> 1

  // State for the new comment input
  const [newComment, setNewComment] = useState('');

  // Fetching Hooks
  const { data: ticket, isLoading: isLoadingTicket } = useGetTicketById(ticketId);
  const { data: comments, isLoading: isLoadingComments } = useGetTicketComments(ticketId);
  const { data: users } = useGetUsers();

  // Mutation Hooks
  const { mutate: updateTicket, isPending: isUpdating } = useUpdateTicket();
  const { mutate: addComment, isPending: isAddingComment } = useCreateComment();

  // Handlers for quick updates
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTicket({ id: ticketId, status: e.target.value as any });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value ? Number(e.target.value) : null;
    updateTicket({ id: ticketId, assignedToUserId: userId as any });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    addComment({ ticketId, message: newComment }, {
      onSuccess: () => setNewComment('') // Clear the input after success
    });
  };

  if (isLoadingTicket) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
  }

  if (!ticket) {
    return <div className="p-8 text-center text-red-500">Ticket not found.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-6 mt-6">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Ticket Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 ${
                ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                ticket.priority === 'medium' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {ticket.priority.toUpperCase()} PRIORITY
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            <div className="mt-6 text-xs text-gray-400">
              Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-500" /> Activity & Comments
            </h2>
            
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
              {isLoadingComments ? (
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              ) : comments?.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No comments yet.</p>
              ) : (
                comments?.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="text-sm text-gray-800">{comment.message}</p>
                    <span className="text-xs text-gray-400 block mt-2">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mt-4 overflow-x-auto">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Leave a comment..."

                
                className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
              <button
                type="submit"
                disabled={isAddingComment || !newComment.trim()}
                className="mt-2 flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {isAddingComment ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Post Comment'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Controls (Status & Assignment) */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Ticket Management</h3>
            
            {/* Status Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={ticket.status}
                onChange={handleStatusChange}
                disabled={isUpdating}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Assignee Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <UserIcon className="h-4 w-4" /> Assigned To
              </label>
              <select
                value={ticket.assignedToUserId || ''}
                onChange={handleAssigneeChange}
                disabled={isUpdating}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Unassigned</option>
                {users?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            
            {isUpdating && <p className="text-xs text-blue-500 mt-3 animate-pulse">Saving changes...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}