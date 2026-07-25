import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item.tsx"
import {
  AlertCircleIcon,
  BusIcon,
  HomeIcon,
  MoveRightIcon,
  PlaneIcon,
  RadioIcon,
  TrainIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Marker, MarkerContent } from "@/components/ui/marker.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import type { PropsWithChildren } from "react"
import {
  differenceInCalendarDays,
  differenceInMinutes,
  formatDistance,
  formatDistanceToNowStrict,
} from "date-fns"
import { Link } from "react-router"
import { Button } from "@/components/ui/button.tsx"
import createFetchClient from "openapi-fetch"
import createClient from "openapi-react-query"
import type { paths } from "./api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { Spinner } from "@/components/ui/spinner.tsx"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx"

const fetchClient = createFetchClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
})
const $api = createClient(fetchClient)

function departureLabel(departureAt: Date) {
  if (departureAt.getUTCHours() != 0 || departureAt.getUTCMinutes() != 0) {
    return formatDistanceToNowStrict(departureAt, { addSuffix: true })
  }

  const days = differenceInCalendarDays(departureAt, new Date())
  if (days === 0) return "Today"
  if (days === 1) return "Tomorrow"
  if (days === -1) return "Yesterday"
  return days > 1 ? `In ${days} days` : `${-days} days ago`
}

type ManifestItem =
  paths["/interrail/manifest"]["get"]["responses"]["200"]["content"]["application/json"][number]
type ManifestFlight = Extract<ManifestItem, { type: "flight" }>
type ManifestDestination = Extract<ManifestItem, { type: "destination" }>
type ManifestLeg = Extract<ManifestItem, { type: "leg" }>

const formatTrainTime = (isoTime: string) => {
  const timestamp = new Date(isoTime)
  return timestamp.toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

interface LiveStatusProps {
  scheduled: string
  expected: string | null | undefined
  cancelled: boolean | null | undefined
}

const LiveStatus = ({ scheduled, expected, cancelled }: LiveStatusProps) => {
  const delayMinutes = differenceInMinutes(expected || scheduled, scheduled)

  if (cancelled) {
    return <Badge variant="destructive">Cancelled</Badge>
  }

  if (delayMinutes) {
    return <Badge>Delayed</Badge>
  }

  return (
    <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
      Good Service
    </Badge>
  )
}

interface LiveTimeProps {
  scheduled: string
  expected: string | null | undefined
}

const LiveTime = ({ scheduled, expected }: LiveTimeProps) => {
  const delayMinutes = differenceInMinutes(expected || scheduled, scheduled)

  if (delayMinutes && expected) {
    return (
      <span className="inline-flex items-center gap-x-1">
        <s className="text-muted-foreground">{formatTrainTime(scheduled)}</s>
        <strong>{formatTrainTime(expected)}</strong>
      </span>
    )
  }

  return <strong>{formatTrainTime(scheduled)}</strong>
}

const RouteBadge = ({ children }: PropsWithChildren) => {
  return (
    <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
      {children}
    </Badge>
  )
}

const TravelIcon = ({ mode }: { mode: "train" | "bus" | "plane" }) => {
  switch (mode) {
    case "bus":
      return <BusIcon />
    case "plane":
      return <PlaneIcon />
    case "train":
      return <TrainIcon />
  }
}

const Flight = ({ flight }: { flight: ManifestFlight }) => {
  return (
    <Item
      variant={new Date(flight.departure_at) > new Date() ? "outline" : "muted"}
    >
      <ItemMedia variant="icon">
        <TravelIcon mode="plane" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {flight.start} <MoveRightIcon /> {flight.end}
          <Badge variant="destructive">
            <TriangleAlertIcon data-icon="inline-start" />
            Not available on Interrail
          </Badge>
        </ItemTitle>
        <ItemDescription>
          Take the <RouteBadge>{flight.number}</RouteBadge> to{" "}
          <strong>{flight.end}</strong>.
        </ItemDescription>
      </ItemContent>
      <ItemContent className="flex-none text-center">
        <ItemDescription>
          {departureLabel(new Date(flight.departure_at))}
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}

const Destination = ({ destination }: { destination: ManifestDestination }) => {
  return (
    <Marker variant="separator">
      <MarkerContent>
        {destination.flag} {destination.name}, {destination.country}
      </MarkerContent>
    </Marker>
  )
}

const LiveBadge = () => (
  <Badge variant="destructive">
    <RadioIcon data-icon="inline-start" />
    Live
  </Badge>
)

const Leg = ({ leg }: { leg: ManifestLeg }) => {
  const { data, isError, isLoading, dataUpdatedAt } = $api.useQuery(
    "get",
    "/interrail/departures",
    {
      params: {
        query: {
          from: leg.from,
          to: leg.to,
        },
      },
    }
  )

  const nextDeparture = data?.filter((departure) => !departure.cancelled)[0]

  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <TravelIcon mode={leg.mode} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {leg.from} <MoveRightIcon /> {leg.to}
          {leg.mode !== "train" && (
            <Badge variant="destructive">
              <TriangleAlertIcon data-icon="inline-start" />
              Not available on Interrail
            </Badge>
          )}
        </ItemTitle>
        <ItemDescription>
          <div className="mb-2">
            {isLoading && (
              <div className="flex w-full max-w-lg flex-col gap-2">
                <Skeleton className="h-5 w-full" />
              </div>
            )}
            {isError && <p>Error</p>}
            {!isLoading &&
              !isError &&
              (nextDeparture ? (
                <span>
                  <LiveBadge /> Take the{" "}
                  <RouteBadge>{nextDeparture.line}</RouteBadge>
                  {leg.to == nextDeparture.direction ? " to " : " towards "}
                  <strong>{nextDeparture.direction}</strong> at{" "}
                  <LiveTime
                    scheduled={nextDeparture.departure.scheduled}
                    expected={nextDeparture.departure.actual}
                  />{" "}
                  {nextDeparture.departure.platform && (
                    <span>
                      from platform{" "}
                      <strong>{nextDeparture.departure.platform}</strong>
                    </span>
                  )}{" "}
                  for{" "}
                  <strong>
                    {formatDistance(
                      nextDeparture.departure.scheduled,
                      nextDeparture.arrival.scheduled
                    )}
                  </strong>
                  .
                </span>
              ) : (
                <span>No information available.</span>
              ))}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mb-1">
                <TrainIcon />
                View board
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Departures from {leg.from}</DialogTitle>
                <DialogDescription>
                  <LiveBadge /> Departure information as of{" "}
                  {new Date(dataUpdatedAt).toLocaleTimeString()}.
                </DialogDescription>
              </DialogHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Departs</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.slice(0, 10).map((departure, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <RouteBadge>{departure.line}</RouteBadge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {departure.direction ?? "—"}
                      </TableCell>
                      <TableCell>
                        <LiveTime
                          scheduled={departure.departure.scheduled}
                          expected={departure.departure.actual}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {departure.departure.platform ?? "—"}
                      </TableCell>
                      <TableCell>
                        <LiveStatus
                          scheduled={departure.departure.scheduled}
                          expected={departure.departure.actual}
                          cancelled={departure.cancelled}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}

const PlanItem = ({ item }: { item: ManifestItem }) => {
  switch (item.type) {
    case "flight":
      return <Flight flight={item} />
    case "destination":
      return <Destination destination={item} />
    case "leg":
      return <Leg leg={item} />
    default:
      return null
  }
}

const TravelPlan = () => {
  const { data, isError, isLoading } = $api.useQuery(
    "get",
    "/interrail/manifest"
  )

  if (isLoading)
    return (
      <Alert>
        <Spinner />
        <AlertTitle>Loading...</AlertTitle>
        <AlertDescription>
          The travel plan will be ready in just a few moments.
        </AlertDescription>
      </Alert>
    )
  if (isError)
    return (
      <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
        <AlertCircleIcon />
        <AlertTitle>Failed to load travel plan</AlertTitle>
        <AlertDescription>
          This may be a temporary error, please try again in a few moments.
        </AlertDescription>
      </Alert>
    )

  return (
    <ItemGroup>
      {data?.map((item) => (
        <PlanItem item={item} />
      ))}
    </ItemGroup>
  )
}

const InterrailTripPage = () => {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-y-4 p-4">
      <div className="flex">
        <div className="flex flex-1">
          <div className="w-full text-2xl font-semibold">Europe Trip</div>
        </div>
        <div className="flex">
          <Button variant="secondary" asChild>
            <Link to="/">
              <HomeIcon /> Home
            </Link>
          </Button>
        </div>
      </div>
      <TravelPlan />
    </div>
  )
}

export default InterrailTripPage
