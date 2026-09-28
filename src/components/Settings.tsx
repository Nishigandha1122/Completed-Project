import React from "react";
import {
  User,
  Bell,
  Shield,
  Languages,
  Moon,
  ChevronRight,
} from "lucide-react";

interface SettingsProps {
  user: any;
}

export function Settings({ user }: SettingsProps) {
  const sections = [
    {
      title: "Profile",
      items: [
        {
          id: "acc",
          label: "Account Details",
          icon: User,
          text: "Manage personal info & mobile",
        },
        {
          id: "notif",
          label: "Notifications",
          icon: Bell,
          text: "Manage crop alerts & weather updates",
        },
      ],
    },
    {
      title: "Privacy & System",
      items: [
        {
          id: "pass",
          label: "Security",
          icon: Shield,
          text: "Password & Biometrics",
        },
        {
          id: "theme",
          label: "Theme & Appearance",
          icon: Moon,
          text: "Dark Green / Light theme",
        },
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-8">
        SQL Account Settings
      </h2>

      <div className="bg-white rounded-[2.5rem] p-8 border shadow-sm mb-8 flex items-center gap-6">
        <div className="w-20 h-20 bg-green-100 rounded-[2rem] flex items-center justify-center text-green-600">
          <User size={40} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-slate-400 text-sm font-medium">{user?.email}</p>
          <span className="inline-block mt-2 text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest italic">
            SQL Database Store
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 italic">
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  className="w-full bg-white p-4 rounded-3xl border flex items-center gap-4 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500">
                    <item.icon size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-slate-800 text-sm">
                      {item.label}
                    </div>
                    <div className="text-slate-400 text-xs">{item.text}</div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
