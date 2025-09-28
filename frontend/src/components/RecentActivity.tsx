"use client";

import { Clock, Plus, UserPlus, Gamepad2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { RecentActivityProps } from "@/lib/types";

const getActivityIcon = (type: string) => {
  switch (type) {
    case "player_added":
      return <UserPlus className="text-game-primary w-4 h-4" />;
    case "game_added":
      return <Gamepad2 className="text-game-primary w-4 h-4" />;
    case "score_updated":
      return <Plus className="text-game-primary w-4 h-4" />;
    case "player_removed":
    case "game_removed":
      return <Trash2 className="text-red-400 w-4 h-4" />;
    default:
      return <Plus className="text-game-primary w-4 h-4" />;
  }
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <section className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="bg-black/50 border-b border-yellow-500/20 p-4">
        <h2 className="text-xl font-semibold text-game-primary flex items-center">
          <Clock className="mr-2" size={20} />
          Recent Activity
        </h2>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3 hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-400/10 p-2 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{activity.message}</p>
                    <p className="text-sm text-gray-400">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
