/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/TIvFenuFjuQ
 */
import { ScrollArea } from "@/components/ui/scroll-area"
import { Playlist } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

type Props = {
  playlist: Playlist
}

export function ChangeRequests({ playlist }: Props) {
  if (!playlist.metadata?.changeRequests || playlist.metadata.changeRequests.length === 0) {
    return <></>;
  }

  return (
    <div className="mt-8 px-8 py-4">
      <h2 className="text-2xl font-bold mb-4">Change Requests</h2>
      <ScrollArea className="max-h-72 w-full rounded-md border border-gray-200 bg-white text-black dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">+/-</TableHead>
              <TableHead className="max-w-96">Track</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-10">Approve</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              playlist.metadata.changeRequests.map((request, index) => (
                <TableRow key={index} className={request.changeType === "add" ? "bg-green-300/50" : "bg-red-300/50"}>
                  <TableCell>
                    {request.changeType === "add" ? "+" : "-"}
                  </TableCell>
                  <TableCell>
                    <iframe
                      width="100%"
                      height="100"
                      title={`${request.track?.name} - ${request.track?.artist}`}
                      src={`https://open.spotify.com/embed/track/${request.track?.id}?utm_source=oembed`}
                    >
                    </iframe>
                  </TableCell>
                  <TableCell>Luke</TableCell>
                  <TableCell>{new Date(Date.parse(request.createdAt)).toLocaleString()}</TableCell>
                  <TableCell>
                    <button className="text-green-500">
                      <CheckIcon className="h-5 w-5" />
                    </button>
                    <button className="text-red-500">
                      <XIcon className="h-5 w-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        <ul className="p-4 space-y-2">
          <li className="border-b">
            <div className="grid grid-cols-4 gap-4 items-center">
              <span>Track</span>
              <span>Request</span>
              <span>Requested</span>
              <span>Actions</span>
            </div>
          </li>
          {
            playlist.metadata.changeRequests.map((request, index) => (
              <li key={index} className="border-b">
                <div className="grid grid-cols-4 gap-4 items-center">
                  {/* <a className="underline cursor-pointer" href={`https://open.spotify.com/track/${request.track?.id}`} target="_blank">
                      <q>{request.track?.name}</q> by {request.track?.artist}
                    </a> */}
                  <iframe
                    width="100%"
                    height="100"
                    title={`${request.track?.name} - ${request.track?.artist}`}
                    style={{ borderRadius: "12px" }}
                    src={`https://open.spotify.com/embed/track/${request.track?.id}?utm_source=oembed`}
                  >
                  </iframe>
                  <span className="text-center">Luke requested to {request.changeType}</span>
                  <span className="text-center">{new Date(Date.parse(request.createdAt)).toLocaleString()}</span>
                  <div className="flex items-center space-x-2 justify-center">
                    <button className="text-green-500">
                      <CheckIcon className="h-5 w-5" />
                    </button>
                    <button className="text-red-500">
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          }
        </ul>
      </ScrollArea>
    </div>
  )
}


function CheckIcon(props: any) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}


function XIcon(props: any) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
