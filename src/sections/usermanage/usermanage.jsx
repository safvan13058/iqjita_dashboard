import React, { useEffect, useState } from 'react';
import './UserTable.css'; // Import the CSS for styling

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState('all');
    const [statusMsg, setStatusMsg] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const apiBase = 'https://software.iqjita.com/user_api.php';
    const signupApi = 'https://software.iqjita.com/authentication.php?action=signup';

    const roles = ['admin', 'administrator', 'superadmin', 'staff', 'student'];

    const [newUser, setNewUser] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'staff',
        branch_id: user.branch_id,
    });

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${apiBase}?action=list`);
            const data = await res.json();
            if (data.status) {
                setUsers(data.users);
                filterUsers(data.users, selectedRole);
            } else {
                setStatusMsg('Failed to load users');
            }
        } catch {
            setStatusMsg('Error connecting to server');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const res = await fetch(`${apiBase}?action=update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, new_role: newRole }),
            });
            const data = await res.json();
            setStatusMsg(data.message);
            fetchUsers();
        } catch {
            setStatusMsg('Error updating role');
        }
    };

    const handleFilterChange = (e) => {
        const role = e.target.value;
        setSelectedRole(role);
        filterUsers(users, role);
    };

    const filterUsers = (allUsers, role) => {
        if (role === 'all') {
            setFilteredUsers(allUsers);
        } else {
            setFilteredUsers(allUsers.filter(user => user.role === role));
        }
    };

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handleAddUser = async () => {
        try {
            const res = await fetch(signupApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            const data = await res.json();
            if (data.status) {
                setShowAddModal(false);
                setNewUser({ name: '', username: '', email: '', password: '', role: 'staff', branch_id: 1 });
                setStatusMsg('User added successfully');
                fetchUsers();
            } else {
                setStatusMsg(data.message || 'Failed to add user');
            }
        } catch {
            setStatusMsg('Error creating user');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="user-management">
            <h2 className='usermanageh1'>User Management</h2>

            {statusMsg && <p className="status-message">{statusMsg}</p>}

            <div className="controls">
                <label>
                    Filter by Role:
                    <select value={selectedRole} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </label>

                <button className="add-user-btn" onClick={() => setShowAddModal(true)}>
                    ➕ Add User
                </button>
            </div>
<div className="table-wrapper">
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th><th>Name</th><th>Email</th><th>Branch</th><th>Current Role</th><th>Change Role</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length === 0 ? (
                        <tr><td colSpan="6">No users found.</td></tr>
                    ) : (
                        filteredUsers.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td> {/* Index number */}
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.branch_name}</td>
                                <td>{user.role}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={e => handleRoleChange(user.id, e.target.value)}
                                    >
                                        {roles.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="add-user-modal-overlay">
                    <div className="add-user-modal">
                        <h3>Add New User</h3>

                        <input name="name" placeholder="Name" value={newUser.name} onChange={handleNewUserChange} />
                        <input name="username" placeholder="Username" value={newUser.username} onChange={handleNewUserChange} />
                        <input name="email" placeholder="Email" type="email" value={newUser.email} onChange={handleNewUserChange} />
                        <input name="password" placeholder="Password" type="password" value={newUser.password} onChange={handleNewUserChange} />
                        <select name="role" value={newUser.role} onChange={handleNewUserChange}>
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        <input name="branch_id" placeholder="Branch ID" type="number" value={newUser.branch_id} onChange={handleNewUserChange} />

                        <div className="modal-actions">
                            <button onClick={handleAddUser}>Submit</button>
                            <button onClick={() => setShowAddModal(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;
