import React from 'react';

export default function Team() {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Chief Executive Officer',
      bio: '15+ years in financial markets with expertise in institutional trading.',
      imageUrl: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Chief Trading Officer',
      bio: 'Former hedge fund manager specializing in forex and commodities markets.',
      imageUrl: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 3,
      name: 'Amara Patel',
      role: 'Head of Risk Management',
      bio: 'Expert in quantitative analysis and developing risk models for trading firms.',
      imageUrl: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 4,
      name: 'David Rodriguez',
      role: 'Chief Technology Officer',
      bio: 'Pioneered multiple trading platforms with focus on low-latency execution systems.',
      imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  return (
    <section 
      id="team" 
      className="py-24 bg-white dark:bg-slate-900"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our leadership team brings decades of experience from top financial institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map(member => (
            <div 
              key={member.id} 
              className="bg-gray-50 dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm
                        transform transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={member.imageUrl} 
                  alt={member.name}
                  className="w-full h-full object-cover object-center transform transition duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}