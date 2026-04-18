import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AccountCard from '../components/AccountCard';
import { fetchUserProfile, editUserProfile } from '../redux/userSlice';
import './edit-form.css';

export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const { profile, status } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/login');
      return;
    }
    
    if (status === 'idle') {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, token, status, dispatch, navigate]);

  useEffect(() => {
    if (profile) {
      setEditFirstName(profile.firstName || '');
      setEditLastName(profile.lastName || '');
    }
  }, [profile]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (profile) {
      setEditFirstName(profile.firstName || '');
      setEditLastName(profile.lastName || '');
    }
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    dispatch(editUserProfile({ firstName: editFirstName, lastName: editLastName }));
    setIsEditing(false);
  };

  if (!isAuthenticated || !profile) {
    return <main className="main bg-dark"><div style={{color:'white', padding: '2rem'}}>Loading...</div></main>;
  }

  return (
    <main className="main bg-dark">
      <div className="header">
        <h1>Welcome back<br />{profile.firstName} {profile.lastName}!</h1>
        {isEditing ? (
          <form className="edit-form" onSubmit={handleSaveClick}>
            <div className="edit-form-inputs">
              <input 
                type="text" 
                value={editFirstName} 
                onChange={(e) => setEditFirstName(e.target.value)} 
                required 
              />
              <input 
                type="text" 
                value={editLastName} 
                onChange={(e) => setEditLastName(e.target.value)} 
                required 
              />
            </div>
            <div className="edit-form-buttons">
              <button type="submit" className="edit-button-save">Save</button>
              <button type="button" className="edit-button-cancel" onClick={handleCancelClick}>Cancel</button>
            </div>
          </form>
        ) : (
          <button className="edit-button" onClick={handleEditClick}>Edit Name</button>
        )}
      </div>
      <h2 className="sr-only">Accounts</h2>
      <AccountCard 
        title="Argent Bank Checking (x8349)" 
        amount="$2,082.79" 
        description="Available Balance" 
      />
      <AccountCard 
        title="Argent Bank Savings (x6712)" 
        amount="$10,928.42" 
        description="Available Balance" 
      />
      <AccountCard 
        title="Argent Bank Credit Card (x8349)" 
        amount="$184.30" 
        description="Current Balance" 
      />
    </main>
  );
}
