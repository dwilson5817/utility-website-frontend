import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item.tsx"
import {
  ArrowLeftIcon,
  BusIcon,
  MoveRightIcon,
  PlaneIcon,
  TrainIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Marker, MarkerContent } from "@/components/ui/marker.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { differenceInCalendarDays, formatDistanceToNowStrict } from "date-fns"
import { Link } from "react-router"
import { Button } from "@/components/ui/button.tsx"

type TravelMode = "train" | "plane" | "bus"

type DepartureTime = { datetime: string; specific_time?: boolean }

type TravelPlanItem =
  | { type: "destination"; name: string; flag: string; country: string }
  | {
      type: "travel"
      start: string
      end: string
      service: string
      operator: string
      destination?: string
      interrail_excluded?: boolean
      method: TravelMode
      departure_at: DepartureTime
    }

const TRAVEL_PLAN: TravelPlanItem[] = [
  { type: "destination", flag: "🇮🇪", name: "Dublin", country: "Ireland" },
  {
    type: "travel",
    service: "EI 0680",
    start: "Dublin",
    end: "Geneva",
    operator: "Aer Lingus",
    method: "plane",
    departure_at: { datetime: "2026-07-29T05:15:00Z", specific_time: true },
  },
  { type: "destination", flag: "🇨🇭", name: "Geneva", country: "Switzerland" },
  {
    type: "travel",
    start: "Genève-Aéroport",
    service: "IR 15",
    end: "Bern",
    destination: "Luzern",
    operator: "SBB",
    method: "train",
    departure_at: { datetime: "2026-07-29T23:59:59Z" },
  },
  {
    type: "travel",
    start: "Bern",
    end: "Spiez",
    service: "IC 61",
    destination: "Interlaken Ost",
    operator: "SBB",
    method: "train",
    departure_at: { datetime: "2026-07-29T23:59:59Z" },
  },
  {
    type: "travel",
    start: "Spiez, Bahnhof",
    end: "Därligen, Dorf",
    destination: "Interlaken Ost, Bahnhof",
    service: "60",
    interrail_excluded: true,
    operator: "SBB",
    method: "bus",
    departure_at: { datetime: "2026-07-29T23:59:59Z" },
  },
  { type: "destination", flag: "🇨🇭", name: "Därligen", country: "Switzerland" },
  {
    type: "travel",
    start: "Därligen, Dorf",
    end: "Spiez, Bahnhof",
    service: "60",
    operator: "SBB",
    interrail_excluded: true,
    method: "bus",
    departure_at: { datetime: "2026-08-01T23:59:59Z" },
  },
  {
    type: "travel",
    start: "Spiez",
    end: "Zürich HB",
    service: "IC 61",
    operator: "SBB",
    method: "train",
    departure_at: { datetime: "2026-08-01T23:59:59Z" },
  },
  {
    type: "travel",
    start: "Zürich HB",
    end: "München Hauptbahnhof",
    service: "EC 193",
    operator: "DB",
    method: "train",
    departure_at: { datetime: "2026-08-01T23:59:59Z" },
  },
  { type: "destination", flag: "🇩🇪", name: "Munich", country: "Germany" },
  {
    type: "travel",
    start: "München Hauptbahnhof",
    service: "RE 25",
    end: "Regensburg Hauptbahnhof",
    operator: "Die Länderbahn",
    method: "train",
    departure_at: { datetime: "2026-08-03T23:59:59Z" },
  },
  {
    type: "travel",
    start: "Regensburg Hauptbahnhof",
    end: "Prague Main Train Station",
    destination: "Praha-Vysocany",
    service: "RE 25",
    operator: "Die Länderbahn",
    method: "train",
    departure_at: { datetime: "2026-08-03T23:59:59Z" },
  },
  {
    type: "destination",
    flag: "🇨🇿",
    name: "Prague",
    country: "Czech Republic",
  },
  {
    type: "travel",
    start: "Prague Main Train Station",
    service: "RJ 382",
    end: "Berlin Hauptbahnhof",
    operator: "Ceske Drahy",
    method: "train",
    departure_at: { datetime: "2026-08-05T23:59:59Z" },
  },
  { type: "destination", flag: "🇩🇪", name: "Berlin", country: "Germany" },
  {
    type: "travel",
    start: "Berlin",
    end: "Dublin",
    service: "EI 0337",
    operator: "Aer Lingus",
    method: "plane",
    departure_at: { datetime: "2026-08-08T20:45:00Z", specific_time: true },
  },
  { type: "destination", flag: "🇮🇪", name: "Dublin", country: "Ireland" },
]

const ModeOfTravelIcon = ({ method }: { method: TravelMode }) => {
  switch (method) {
    case "plane":
      return <PlaneIcon />
    case "train":
      return <TrainIcon />
    case "bus":
      return <BusIcon />
    default:
      return null
  }
}

function departureLabel(departureAt: DepartureTime) {
  const { specific_time, datetime } = departureAt

  if (specific_time) {
    return formatDistanceToNowStrict(datetime, { addSuffix: true })
  }

  const days = differenceInCalendarDays(datetime, new Date())
  if (days === 0) return "Today"
  if (days === 1) return "Tomorrow"
  if (days === -1) return "Yesterday"
  return days > 1 ? `In ${days} days` : `${-days} days ago`
}

const TravelItem = ({ item }: { item: TravelPlanItem }) => {
  switch (item.type) {
    case "destination":
      return (
        <Marker variant="separator">
          <MarkerContent>
            {item.flag} {item.name}, {item.country}
          </MarkerContent>
        </Marker>
      )
    case "travel":
      return (
        <Item
          variant={
            new Date(item.departure_at.datetime) > new Date()
              ? "outline"
              : "muted"
          }
        >
          <ItemMedia variant="icon">
            <ModeOfTravelIcon method={item.method} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              {item.start} <MoveRightIcon /> {item.end}
              {item.interrail_excluded && (
                <Badge variant="destructive">
                  <TriangleAlertIcon data-icon="inline-start" />
                  Not available on Interrail
                </Badge>
              )}
            </ItemTitle>
            <ItemDescription>
              Take the{" "}
              <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                {item.service}
              </Badge>{" "}
              {item.method}{" "}
              {item.destination ? (
                <span>
                  towards <strong>{item.destination}</strong>
                </span>
              ) : (
                <span>
                  to <strong>{item.end}</strong>
                </span>
              )}{" "}
              &bull; Operated by <strong>{item.operator}</strong>
            </ItemDescription>
          </ItemContent>
          <ItemContent className="flex-none text-center">
            <ItemDescription>
              {item.departure_at && departureLabel(item.departure_at)}
            </ItemDescription>
          </ItemContent>
        </Item>
      )
    default:
      return null
  }
}

const EuropeTripPage = () => {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 py-4">
      <div>
        <Button asChild>
          <Link to="/">
            <ArrowLeftIcon /> Back
          </Link>
        </Button>
      </div>
      {TRAVEL_PLAN.map((elem) => (
        <TravelItem item={elem} />
      ))}
    </div>
  )
}

export default EuropeTripPage
