"use client";

import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarImage } from "./ui/avatar";
import { BasePlaylist } from "@/types";

type Props = {
  playlists: BasePlaylist[],
  selectPlaylistFn: (id: any) => void,
  selectedPlaylistId: string | null,
}

export default function PlaylistList({ playlists, selectedPlaylistId, selectPlaylistFn }: Props) {
  function generatePlaylistListClassName(id: string): string {
    return `flex items-center space-x-2 cursor-pointer ${selectedPlaylistId === id ? "bg-black/20 dark:bg-white/20 hover:bg-black/30 dark:hover:bg-white/30" : "hover:bg-black/10 dark:hover:bg-white/10"}`;
  }

  return (
    <nav className="w-60 flex flex-col dark:bg-[#000] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider">Your Playlists</h2>
        <div className="flex space-x-1">
          <Button variant="ghost">
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="mt-4 space-y-2 flex-1">
        {
          playlists.map((playlist, index) => (
            <div key={index} className={generatePlaylistListClassName(playlist.id)} onClick={() => selectPlaylistFn(playlist.id)}>
              <Avatar>
                <AvatarImage alt="Playlist" src={playlist.images[playlist.images.length - 1].url} />
              </Avatar>
              <div className="flex text-sm truncate overflow-hidden whitespace-nowrap">{playlist.name}</div>
            </div>
          ))
        }
      </ScrollArea>
    </nav>
  )
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
