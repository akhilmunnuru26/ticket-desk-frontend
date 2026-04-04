'use client';

import { useForm } from 'react-hook-form';
import { useCreateTicket } from '@/hooks/useTickets';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

// Define the shape of our form data for TypeScript
type TicketFormData = {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
};

export default function CreateTicketPage() {
  const router = useRouter();
  
  // 1. Setup React Query Mutation
  const { mutate: createTicket, isPending, isError } = useCreateTicket();
  
  // 2. Setup React Hook Form with basic validation rules
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<TicketFormData>({
    defaultValues: {
      priority: 'low', // Provide a sensible default
    }
  });

  // 3. The Submit Handler
  const onSubmit = (data: TicketFormData) => {
    createTicket(data, {
      onSuccess: () => {
        // Redirect back to the dashboard once the database confirms creation!
        router.push('/'); 
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl p-6 mt-10">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Ticket</h1>

        {isError && (
          <div className="mb-6 flex items-center p-4 text-red-800 bg-red-50 rounded-md">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>Failed to create ticket. Please try again.</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Ticket Title</label>
            <input
              id="title"
              type="text"
              {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'Title must be at least 5 characters' } })}
              className={`mt-1 block w-full rounded-md border ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm`}
              placeholder="e.g., Cannot access staging server"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              rows={4}
              {...register('description', { required: 'Description is required' })}
              className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm`}
              placeholder="Provide detailed steps to reproduce the issue..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Priority Dropdown */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority Level</label>
            <select
              id="priority"
              {...register('priority')}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Ticket...
                </>
              ) : (
                'Submit Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}