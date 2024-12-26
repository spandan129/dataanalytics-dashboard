import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    Calendar,
    ChevronDown,
    Filter,
    UserIcon,
    Clock,
    MapPin,
    ArrowRightIcon
} from 'lucide-react';

// Types for our data structures
interface TopUser {
    _id: string;
    username: string | null;
    session_count: number;
}

interface UserSession {
    session_start: string;
    session_end: string;
    path_history: string[];
}

const UserSessionsDashboard: React.FC = () => {
    const [topUsers, setTopUsers] = useState<TopUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [userSessions, setUserSessions] = useState<UserSession[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
    const yearDropdownRef = useRef<HTMLDivElement>(null);
    const monthDropdownRef = useRef<HTMLDivElement>(null);

    const [selectedYear, setSelectedYear] = useState<string>(() =>
        new Date().getFullYear().toString()
    );
    const [selectedMonth, setSelectedMonth] = useState<string>(() =>
        (new Date().getMonth() + 1).toString().padStart(2, '0')
    );

    const years = Array.from(
        { length: 5 },
        (_, i) => (new Date().getFullYear() - 2 + i).toString()
    );
    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
                setIsYearDropdownOpen(false);
            }
            if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
                setIsMonthDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Custom Select Component
    const CustomSelect = ({
        options,
        value,
        onChange,
        isOpen,
        toggleOpen,
        ref,
        placeholder
    }: {
        options: { value: string; label: string }[];
        value: string;
        onChange: (value: string) => void;
        isOpen: boolean;
        toggleOpen: () => void;
        ref: React.RefObject<HTMLDivElement>;
        placeholder: string;
    }) => {
        const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

        return (
            <div ref={ref} className="relative">
                <button
                    onClick={toggleOpen}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {selectedLabel}
                    <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
                </button>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    toggleOpen();
                                }}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 cursor-pointer"
                            >
                                {option.label}
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        );
    };

    const fetchTopUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const adminId = localStorage.getItem('admin_id');

            if (!adminId) {
                throw new Error('No admin ID found in localStorage');
            }

            const response = await axios.get(`http://localhost:8000/get_top_users/${adminId}`);
            setTopUsers(response.data);
            setIsLoading(false);
        } catch (err) {
            setError('Failed to fetch top users');
            setIsLoading(false);
        }
    }, []);

    const fetchUserSessions = useCallback(async (userId: string) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:8000/sessions/${userId}`, {
                params: {
                    year: selectedYear,
                    month: selectedMonth
                }
            });
            if (response.data.detail) {
                setUserSessions([]);
            } else {
                setUserSessions(response.data);
                setIsLoading(false);
            }

        } catch (err) {
            setError('Session not found for the given user_id');
            setIsLoading(false);
        }
    }, [selectedYear, selectedMonth]);

    useEffect(() => {
        fetchTopUsers();
    }, [fetchTopUsers]);

    useEffect(() => {
        if (selectedUser) {
            fetchUserSessions(selectedUser);
        }
    }, [selectedUser, fetchUserSessions]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const calculateSessionDuration = (start: string, end: string) => {
        const startTime = new Date(start);
        const endTime = new Date(end);
        const durationMs = endTime.getTime() - startTime.getTime();
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200
            }
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 flex  font-archivo">
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-1/4 bg-gray-50 p-6 border-r border-gray-200 max-h-screen overflow-y-scroll"
            >
                <div className="sticky top-0 bg-gray-50 z-10 pb-4">
                    <h2 className="text-2xl font-bold mb-4 text-black flex items-center">
                        <UserIcon className="mr-2 text-black" />
                        Top Users
                    </h2>
                </div>

                {isLoading ? (
                    <div className="text-center text-gray-500">Loading users...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <motion.ul
                        variants={listVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-2"
                    >
                        {topUsers.map((user) => (
                            <motion.li
                                key={user._id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setSelectedUser(user._id);
                                }}
                                className={`
                  p-3 rounded-lg cursor-pointer transition-all duration-300
                  ${selectedUser === user._id
                                        ? 'bg-indigo-50 text-black shadow-md'
                                        : 'hover:bg-gray-200 hover:shadow-sm'}
                `}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                        {user.username || `User ${user._id.slice(-5)}`}
                                    </span>
                                    <span className="text-sm text-indigo-800 bg-indigo-100 border border-indigo-600 px-2 py-1 rounded-full">
                                        {user.session_count} sessions
                                    </span>
                                </div>
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </motion.div>

            <div className="w-3/4 p-8 flex flex-col ">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex justify-between items-center mb-6 "
                >
                    <div className="flex items-center space-x-4 ">
                        <Filter className="text-black" />
                        <div className="relative">
                            <CustomSelect
                                ref={yearDropdownRef}
                                options={years.map(year => ({ value: year, label: year }))}
                                value={selectedYear}
                                onChange={setSelectedYear}
                                isOpen={isYearDropdownOpen}
                                toggleOpen={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                                placeholder="Year"
                            />
                        </div>
                        <div className="relative w-[120px]">
                            <CustomSelect
                                ref={monthDropdownRef}
                                options={months}
                                value={selectedMonth}
                                onChange={setSelectedMonth}
                                isOpen={isMonthDropdownOpen}
                                toggleOpen={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                                placeholder="Month"
                            />
                        </div>
                    </div>
                </motion.div>

                {selectedUser ? (
                    <div className="flex-1 pr-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className=''
                        >
                            <h3 className="text-2xl font-bold mb-6 text-black flex items-center">
                                <Clock className="mr-2 text-black" />
                                Sessions of User {selectedUser.slice(-5)}
                            </h3>

                            {isLoading ? (
                                <div className="text-center text-gray-500">Loading sessions...</div>
                            ) : userSessions.length === 0 ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-gray-500 text-center py-10"
                                >
                                    No sessions found for the selected period
                                </motion.div>
                            ) : (
                                <AnimatePresence>
                                    <motion.div
                                        variants={listVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="space-y-4 overflow-y-scroll h-[680px]"
                                    >
                                        {userSessions.length > 0 && userSessions.map((session, index) => (
                                            <motion.div
                                                key={index}
                                                variants={itemVariants}
                                                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-semibold text-gray-700 flex items-center">
                                                        <MapPin className="mr-2 text-indigo-600 w-4 h-4" />
                                                        Session {index + 1}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        Duration: {calculateSessionDuration(session.session_start, session.session_end)}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <p className="text-sm text-gray-600 mt-2 ">Start Time</p>
                                                        <p className="font-medium">{formatDate(session.session_start)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">End Time</p>
                                                        <p className="font-medium">{formatDate(session.session_end)}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <p className="text-sm text-gray-600">Navigation Path</p>
                                                    <div className="flex items-center space-x-2 overflow-x-auto py-2">
                                                        {session.path_history.map((path, index) => (
                                                            <React.Fragment key={index}>
                                                                <div className="flex items-center">
                                                                    <div className="bg-blue-100 text-indigo-700 px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                                                                        {path || 'Unknown'}
                                                                    </div>
                                                                    {session.path_history.length > index + 1 && session.path_history.length > 1 && index < path.length - 1 && (
                                                                        <ArrowRightIcon className="w-4 h-4 mx-2 text-gray-500" />
                                                                    )}
                                                                </div>
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </motion.div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-full flex items-center justify-center text-gray-500"
                    >
                        Select a user to view their session details
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default UserSessionsDashboard;