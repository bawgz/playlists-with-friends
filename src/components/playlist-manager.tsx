"use client";

/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/NW5MslhUPSm
 */
import { Button } from "@/components/ui/button"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import Image from "next/image"
import { Playlist } from "@/types";

type Props = {
  playlist: Playlist
}

export function PlaylistManager({ playlist }: Props) {

  function msToTime(durationMs: number): string {
    const seconds = Math.floor((durationMs / 1000) % 60),
      minutes = Math.floor((durationMs / (1000 * 60)) % 60),
      hours = Math.floor((durationMs / (1000 * 60 * 60)));

    const hoursDisplay = (hours > 0) ? hours + ":" : "";
    const minutesDisplay = minutes < 10 && hoursDisplay !== "" ? "0" + minutes : minutes;
    const secondsDisplay = seconds < 10 ? "0" + seconds : seconds;

    return hoursDisplay + minutesDisplay + ":" + secondsDisplay;
  }

  return (
    <main className="flex-1 overflow-y-auto">
      {
        playlist && (
          <>
            <div className="relative">
              <Image
                alt="Playlist cover"
                className="w-full h-72 object-cover"
                height="300"
                src={playlist.images[0].url}
                style={{
                  aspectRatio: "1360/300",
                  objectFit: "cover",
                }}
                width="1360"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent" />
              <div className="absolute bottom-0 p-8">
                <h1 className="text-4xl font-bold text-white">{playlist.name}</h1>
                <p className="text-sm mt-2 text-white">
                  {playlist.description}
                </p>
                {playlist.tracks?.total > 0 && (
                  <p className="text-xs mt-1 text-gray-300">{playlist.tracks.total} songs</p>
                )}
              </div>
            </div>
            <div className="px-8 py-4">
              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Album</TableHead>
                      <TableHead className="w-24">Time</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playlist.tracks.items?.map((song, index) => (
                      <TableRow key={index + 1}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{song.title}</TableCell>
                        <TableCell>{song.artist}</TableCell>
                        <TableCell>{msToTime(song.durationMs)}</TableCell>
                        <TableCell>
                          <Button className="hover:bg-[#121212]" variant="ghost">
                            <TrashIcon className="w-6 h-6" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </div>
            </div>
          </>
        )
      }
    </main>
  )
}


function TrashIcon(props: any) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}
