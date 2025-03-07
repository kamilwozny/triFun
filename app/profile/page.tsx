'use client';

import Image from 'next/image';

export default function ProfilePage() {
  const user = {
    name: 'John Doe',
    location: 'New York, USA',
    bio: 'Triathlete | Swimmer | Cyclist | Runner',
    profilePic: '/profile.jpg',
    stats: {
      totalDistance: '1,500 km',
      totalTime: '120h',
      achievements: ['Ironman Finisher', 'Marathon Runner'],
    },
  };

  const events = [
    {
      date: '2025-04-10',
      name: 'Spring Triathlon',
      sport: 'Triathlon',
      distance: '150 km',
    },
    {
      date: '2025-05-22',
      name: 'Ironman 70.3',
      sport: 'Triathlon',
      distance: '113 km',
    },
  ];

  return (
    <div className="container mx-auto p-6 min-h-screen flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <div className="flex items-center space-x-4">
          <div className="avatar">
            <div className="w-24 rounded">
              {/* <Image alt="Avatar" width={100} height={100} /> */}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.location}</p>
            <p className="text-gray-700 italic">{user.bio}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full max-w-3xl">
        <h3 className="text-lg font-semibold text-white mb-3">Statistics</h3>
        <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-md">
          <div>
            <p className="font-bold">Events created</p>
          </div>
          <div>
            <p className="font-bold">Events visited</p>
          </div>
          <div>
            <p className="font-bold">Last training</p>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full max-w-3xl">
        <h3 className="text-lg font-semibold text-white mb-3">
          Upcoming Events
        </h3>
        <div className="grid gap-4">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between"
            >
              <div>
                <p className="font-bold">{event.name}</p>
                <p className="text-gray-600">{event.date}</p>
                <p>
                  {event.sport} - {event.distance}
                </p>
              </div>
              <button className="btn btn-primary">View</button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <button className="btn btn-secondary">Edit Profile</button>
      </div>
    </div>
  );
}
