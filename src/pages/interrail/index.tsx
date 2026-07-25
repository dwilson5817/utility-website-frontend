import {
  Item,
  ItemContent,
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
import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react"
import {
  differenceInCalendarDays,
  differenceInMinutes,
  formatDistance,
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
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx"
import { Separator } from "@/components/ui/separator.tsx"

const fetchClient = createFetchClient<paths>({
  baseUrl: import.meta.env.VITE_API_INTERRAIL_BASE_URL,
})
const $api = createClient(fetchClient)

type WeatherIcon = { description: string; image: string }
const weatherIcons: {
  [code: number]: { day: WeatherIcon; night: WeatherIcon }
} = {
  0: {
    day: {
      description: "Sunny",
      image: "https://openweathermap.org/img/wn/01d@2x.png",
    },
    night: {
      description: "Clear",
      image: "https://openweathermap.org/img/wn/01n@2x.png",
    },
  },
  1: {
    day: {
      description: "Mainly Sunny",
      image: "https://openweathermap.org/img/wn/01d@2x.png",
    },
    night: {
      description: "Mainly Clear",
      image: "https://openweathermap.org/img/wn/01n@2x.png",
    },
  },
  2: {
    day: {
      description: "Partly Cloudy",
      image: "https://openweathermap.org/img/wn/02d@2x.png",
    },
    night: {
      description: "Partly Cloudy",
      image: "https://openweathermap.org/img/wn/02n@2x.png",
    },
  },
  3: {
    day: {
      description: "Cloudy",
      image: "https://openweathermap.org/img/wn/03d@2x.png",
    },
    night: {
      description: "Cloudy",
      image: "https://openweathermap.org/img/wn/03n@2x.png",
    },
  },
  45: {
    day: {
      description: "Foggy",
      image: "https://openweathermap.org/img/wn/50d@2x.png",
    },
    night: {
      description: "Foggy",
      image: "https://openweathermap.org/img/wn/50n@2x.png",
    },
  },
  48: {
    day: {
      description: "Rime Fog",
      image: "https://openweathermap.org/img/wn/50d@2x.png",
    },
    night: {
      description: "Rime Fog",
      image: "https://openweathermap.org/img/wn/50n@2x.png",
    },
  },
  51: {
    day: {
      description: "Light Drizzle",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Light Drizzle",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  53: {
    day: {
      description: "Drizzle",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Drizzle",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  55: {
    day: {
      description: "Heavy Drizzle",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Heavy Drizzle",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  56: {
    day: {
      description: "Light Freezing Drizzle",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Light Freezing Drizzle",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  57: {
    day: {
      description: "Freezing Drizzle",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Freezing Drizzle",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  61: {
    day: {
      description: "Light Rain",
      image: "https://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "Light Rain",
      image: "https://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  63: {
    day: {
      description: "Rain",
      image: "https://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "Rain",
      image: "https://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  65: {
    day: {
      description: "Heavy Rain",
      image: "https://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "Heavy Rain",
      image: "https://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  66: {
    day: {
      description: "Light Freezing Rain",
      image: "https://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "Light Freezing Rain",
      image: "https://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  67: {
    day: {
      description: "Freezing Rain",
      image: "https://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "Freezing Rain",
      image: "https://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  71: {
    day: {
      description: "Light Snow",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Light Snow",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  73: {
    day: {
      description: "Snow",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Snow",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  75: {
    day: {
      description: "Heavy Snow",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Heavy Snow",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  77: {
    day: {
      description: "Snow Grains",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Snow Grains",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  80: {
    day: {
      description: "Light Showers",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Light Showers",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  81: {
    day: {
      description: "Showers",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Showers",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  82: {
    day: {
      description: "Heavy Showers",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Heavy Showers",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  85: {
    day: {
      description: "Light Snow Showers",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Light Snow Showers",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  86: {
    day: {
      description: "Snow Showers",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Snow Showers",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  95: {
    day: {
      description: "Thunderstorm",
      image: "https://openweathermap.org/img/wn/11d@2x.png",
    },
    night: {
      description: "Thunderstorm",
      image: "https://openweathermap.org/img/wn/11n@2x.png",
    },
  },
  96: {
    day: {
      description: "Light Thunderstorms With Hail",
      image: "https://openweathermap.org/img/wn/11d@2x.png",
    },
    night: {
      description: "Light Thunderstorms With Hail",
      image: "https://openweathermap.org/img/wn/11n@2x.png",
    },
  },
  99: {
    day: {
      description: "Thunderstorm With Hail",
      image: "https://openweathermap.org/img/wn/11d@2x.png",
    },
    night: {
      description: "Thunderstorm With Hail",
      image: "https://openweathermap.org/img/wn/11n@2x.png",
    },
  },
}

// Dates without a time are parsed as UTC midnight, so they are formatted in
// UTC too — otherwise a negative offset would shift them to the day before.
const departDateFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  weekday: "long",
  day: "numeric",
  month: "long",
})

const forecastDayFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  weekday: "short",
})

function departureLabel(departure: string) {
  const days = differenceInCalendarDays(departure, new Date())
  if (days === 0) return "Today"
  if (days === 1) return "Tomorrow"
  if (days === -1) return "Yesterday"
  return days > 1 ? `In ${days} days` : `${-days} days ago`
}

// Destination cards show the local time, so they need re-rendering as it ticks.
const useNow = (intervalMs = 60_000) => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  return now
}

type ManifestItem =
  paths["/manifest"]["get"]["responses"]["200"]["content"]["application/json"][number]
type ManifestFlight = Extract<ManifestItem, { type: "flight" }>
type ManifestDestination = Extract<ManifestItem, { type: "destination" }>
type ManifestLeg = Extract<ManifestItem, { type: "leg" }>
type Departure =
  paths["/departures"]["get"]["responses"]["200"]["content"]["application/json"][number]

const formatTrainTime = (isoTime: string) => {
  const timestamp = new Date(isoTime)
  return timestamp.toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

const useDepartures = (leg: ManifestLeg) =>
  $api.useQuery("get", "/departures", {
    params: {
      query: {
        from: leg.from,
        to: leg.to,
      },
    },
  })

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

const NotOnInterrailBadge = () => (
  <Badge variant="destructive">
    <TriangleAlertIcon data-icon="inline-start" />
    Not available on Interrail
  </Badge>
)

const LiveBadge = () => (
  <Badge variant="destructive">
    <RadioIcon data-icon="inline-start" />
    Live
  </Badge>
)

const Route = ({ from, to }: { from: string; to: string }) => (
  <span className="inline-flex items-center gap-2 whitespace-nowrap">
    {from} <MoveRightIcon className="size-4" /> {to}
  </span>
)

const Flight = ({ flight }: { flight: ManifestFlight }) => {
  return (
    <Item variant="outline" className="items-start">
      <ItemMedia variant="icon" className="mt-0.5 self-start">
        <TravelIcon mode="plane" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="line-clamp-none w-full flex-wrap">
          <Route from={flight.start} to={flight.end} />
          <NotOnInterrailBadge />
        </ItemTitle>
        <p className="text-sm text-muted-foreground">
          Take the <RouteBadge>{flight.number}</RouteBadge> to{" "}
          <strong>{flight.end}</strong>.
        </p>
      </ItemContent>
    </Item>
  )
}

interface WeatherInfoProps {
  temperature: number
  temperatureMin?: number
  weatherCode: number
  isDay: boolean
}

const WeatherInfo = ({
  temperature,
  temperatureMin,
  weatherCode,
  isDay,
}: WeatherInfoProps) => {
  const icon = weatherIcons[weatherCode]?.[isDay ? "day" : "night"]

  return (
    <div className="text-center">
      <span className="font-bold whitespace-nowrap">
        {Math.round(temperature)}°C
        {temperatureMin !== undefined && ` / ${Math.round(temperatureMin)}°C`}
      </span>
      {icon && (
        <div className="flex">
          <img className="size-8" src={icon.image} alt={icon.description} />
        </div>
      )}
    </div>
  )
}

const forecastDayLabel = (date: string, index: number) => {
  if (index === 0) return "Today"
  if (index === 1) return "Tomorrow"
  return forecastDayFormat.format(new Date(date))
}

const Destination = ({ destination }: { destination: ManifestDestination }) => {
  const { data } = $api.useQuery("get", "/weather")
  const now = useNow()

  const weatherReport = data?.find(
    (location) => destination.name == location.destination
  )

  const { localTimeFormat, localDateFormat } = useMemo(
    () => ({
      localTimeFormat: new Intl.DateTimeFormat("en-GB", {
        timeZone: destination.timezone,
        hour: "2-digit",
        minute: "2-digit",
      }),
      localDateFormat: new Intl.DateTimeFormat("en-GB", {
        timeZone: destination.timezone,
        month: "short",
        day: "numeric",
        weekday: "short",
      }),
    }),
    [destination.timezone]
  )

  return (
    <>
      <Card size="sm">
        <CardHeader>
          <CardTitle>
            {destination.flag} {destination.name}
          </CardTitle>
          <CardDescription>{destination.country}</CardDescription>
          <CardAction>
            <div className="text-right text-sm font-bold">
              {localTimeFormat.format(now)}
            </div>
            <div className="text-right text-xs font-bold">
              {localDateFormat.format(now)}
            </div>
          </CardAction>
        </CardHeader>
        {weatherReport && (
          <CardContent>
            <div className="flex items-center justify-around gap-1 text-xs sm:gap-2 sm:text-sm md:gap-4">
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium">Now</span>
                <WeatherInfo
                  temperature={weatherReport.current.temperature}
                  weatherCode={weatherReport.current.weather_code}
                  isDay={weatherReport.current.is_day}
                />
              </div>
              {weatherReport.daily.map((daily, index) => (
                <Fragment key={daily.date}>
                  <Separator orientation="vertical" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-medium">
                      {forecastDayLabel(daily.date, index)}
                    </span>
                    <WeatherInfo
                      temperature={daily.temperature_max}
                      temperatureMin={daily.temperature_min}
                      weatherCode={daily.weather_code}
                      isDay
                    />
                  </div>
                </Fragment>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
      {destination.depart && (
        <Marker variant="separator" className="my-2">
          <MarkerContent>
            {departDateFormat.format(new Date(destination.depart))}{" "}
            <Badge>{departureLabel(destination.depart)}</Badge>
          </MarkerContent>
        </Marker>
      )}
    </>
  )
}

interface DepartureSummaryProps {
  leg: ManifestLeg
  departure: Departure | undefined
  isLoading: boolean
  isError: boolean
}

const DepartureSummary = ({
  leg,
  departure,
  isLoading,
  isError,
}: DepartureSummaryProps) => {
  if (isLoading) return <Skeleton className="h-5 w-full max-w-lg" />
  if (isError) return <span>Departure information unavailable.</span>
  if (!departure) return <span>No information available.</span>

  return (
    <span>
      <LiveBadge /> Take the <RouteBadge>{departure.line}</RouteBadge>
      {leg.to == departure.direction ? " to " : " towards "}
      <strong>{departure.direction}</strong> at{" "}
      <LiveTime
        scheduled={departure.departure.scheduled}
        expected={departure.departure.actual}
      />{" "}
      {departure.departure.platform && (
        <span>
          from platform <strong>{departure.departure.platform}</strong>
        </span>
      )}{" "}
      for{" "}
      <strong>
        {formatDistance(
          departure.departure.scheduled,
          departure.arrival.scheduled
        )}
      </strong>
      .
    </span>
  )
}

const DepartureBoard = ({ departures }: { departures: Departure[] }) => {
  if (departures.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        No departures found for this leg.
      </p>
    )
  }

  return (
    <>
      <ul className="flex flex-col divide-y sm:hidden">
        {departures.map((departure, index) => (
          <li
            key={index}
            className="flex items-start justify-between gap-3 py-3"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <span className="truncate font-medium">
                {departure.direction ?? "—"}
              </span>
              <span className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
                <RouteBadge>{departure.line}</RouteBadge>
                {departure.departure.platform
                  ? `Platform ${departure.departure.platform}`
                  : "No platform"}
              </span>
            </div>
            <div className="flex flex-none flex-col items-end gap-1">
              <LiveTime
                scheduled={departure.departure.scheduled}
                expected={departure.departure.actual}
              />
              <LiveStatus
                scheduled={departure.departure.scheduled}
                expected={departure.departure.actual}
                cancelled={departure.cancelled}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="hidden sm:block">
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
            {departures.map((departure, index) => (
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
      </div>
    </>
  )
}

const Leg = ({ leg }: { leg: ManifestLeg }) => {
  const { data, isError, isLoading, dataUpdatedAt } = useDepartures(leg)

  const nextDeparture = data?.find((departure) => !departure.cancelled)

  return (
    <Item variant="outline" className="items-start">
      <ItemMedia variant="icon" className="mt-0.5 self-start">
        <TravelIcon mode={leg.mode} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="line-clamp-none w-full flex-wrap">
          <Route from={leg.from} to={leg.to} />
          {leg.mode !== "train" && <NotOnInterrailBadge />}
        </ItemTitle>
        <div className="mb-2 text-sm text-muted-foreground">
          <DepartureSummary
            leg={leg}
            departure={nextDeparture}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <TrainIcon />
              View board
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Departures from {leg.from}</DialogTitle>
              <DialogDescription>
                <LiveBadge /> Departure information as of{" "}
                {new Date(dataUpdatedAt).toLocaleTimeString()}.
              </DialogDescription>
            </DialogHeader>
            <DepartureBoard departures={data?.slice(0, 10) ?? []} />
          </DialogContent>
        </Dialog>
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
  const { data, isError, isLoading } = $api.useQuery("get", "/manifest")

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

  // A plain column rather than ItemGroup: the plan mixes items, cards and date
  // markers, so it is neither a list nor subject to ItemGroup's data-size rules.
  return (
    <div className="flex w-full flex-col gap-4">
      {data?.map((item, index) => (
        <PlanItem key={index} item={item} />
      ))}
    </div>
  )
}

const InterrailTripPage = () => {
  return (
    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-4 px-4 py-6">
      <div className="flex items-center gap-2">
        <h1 className="flex-1 text-2xl font-semibold">Europe Trip</h1>
        <Button variant="secondary" asChild>
          <Link to="/">
            <HomeIcon /> Home
          </Link>
        </Button>
      </div>
      <TravelPlan />
    </div>
  )
}

export default InterrailTripPage
