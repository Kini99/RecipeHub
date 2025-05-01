import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import { RootState, AppDispatch } from '../store';
import { inviteCollaborators } from '../store/slices/recipeSlice';
import Button from './ui/Button';
import { Recipe } from '../types';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface CollaboratorInviteModalProps {
  recipe: Recipe;
  onClose: () => void;
}

const CollaboratorInviteModal: React.FC<CollaboratorInviteModalProps> = ({
  recipe,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { user: currentUser, token } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          setError('Authentication required');
          return;
        }

        const response = await api.get('/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          // Filter out current user from the list
          setUsers(response.data.filter((user: User) => user._id !== currentUser?.id  && !recipe?.collaborators?.includes(user._id)));
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };
    fetchUsers();
  }, [currentUser?.id, token]);

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      setError('Please select at least one user');
      return;
    }

    if (!token) {
      setError('Authentication required');
      return;
    }

    setLoading(true);
    try {
    const response=  await dispatch(inviteCollaborators({ recipeId: recipe?._id, userIds: selectedUsers }));
      onClose();
      if (response.ok) {
        alert('Invitations sent successfully');
      } else {
        setError('Failed to send invitations. Please try again.');
      }
    } catch (err) {
      setError('Failed to send invitations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Invite Collaborators</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Invite others to collaborate on "{recipe?.title}"
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-h-60 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user._id}
                className={`flex items-center justify-between p-3 rounded mb-2 cursor-pointer ${
                  selectedUsers.includes(user._id)
                    ? 'bg-primary-light bg-opacity-20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleUserSelect(user._id)}
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => { }}
                  className="h-4 w-4 text-primary-light focus:ring-primary-light border-gray-300 rounded"
                />
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || selectedUsers.length === 0}
            >
              {loading ? 'Sending...' : 'Send Invitations'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollaboratorInviteModal; 