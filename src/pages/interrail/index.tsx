import {
  AlertCircleIcon,
  BusIcon,
  ChevronRightIcon,
  HomeIcon,
  PlaneIcon,
  RadioIcon,
  TrainIcon,
} from "lucide-react"
import { Marker, MarkerContent } from "@/components/ui/marker.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react"
import { differenceInCalendarDays, differenceInMinutes } from "date-fns"
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
import { cn } from "@/lib/utils.ts"

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

// Exact journey time rather than date-fns' rounding, which flattens everything
// from 45 minutes to 89 into "about 1 hour".
const formatJourneyTime = (departure: string, arrival: string) => {
  const totalMinutes = differenceInMinutes(arrival, departure)
  if (totalMinutes <= 0) return null

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (!hours) return `${minutes} min`
  if (!minutes) return `${hours} h`
  return `${hours} h ${minutes} min`
}

// en-GB rather than the device locale, so times read as 24-hour everywhere —
// the way every departure board on the trip shows them.
const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
})

const formatTrainTime = (isoTime: string) =>
  timeFormat.format(new Date(isoTime))

// Flights cross time zones, so they are shown at the airport the departure
// actually happens at rather than wherever the phone currently is.
const formatZonedTime = (isoTime: string, timeZone: string) =>
  new Date(isoTime).toLocaleString("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  })

const useDepartures = (leg: ManifestLeg) =>
  $api.useQuery("get", "/departures", {
    params: {
      query: {
        from: leg.from,
        to: leg.to,
      },
    },
  })

interface DelayNoteProps {
  scheduled: string
  expected: string | null | undefined
  cancelled: boolean | null | undefined
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
        <s className="font-normal text-muted-foreground">
          {formatTrainTime(scheduled)}
        </s>
        <strong>{formatTrainTime(expected)}</strong>
      </span>
    )
  }

  return <strong>{formatTrainTime(scheduled)}</strong>
}

// How late a departure is running, as plain text — red is kept for the times it
// should make you look up, rather than spent on every healthy service.
const DelayNote = ({ scheduled, expected, cancelled }: DelayNoteProps) => {
  const delayMinutes = differenceInMinutes(expected || scheduled, scheduled)

  if (cancelled)
    return <span className="font-medium text-destructive">Cancelled</span>

  if (delayMinutes > 0)
    return (
      <span className="font-medium text-destructive">
        {delayMinutes} min late
      </span>
    )

  return <span>On time</span>
}

const TravelIcon = ({ mode }: { mode: "train" | "bus" | "plane" }) => {
  switch (mode) {
    case "bus":
      return <BusIcon className="size-4" />
    case "plane":
      return <PlaneIcon className="size-4" />
    case "train":
      return <TrainIcon className="size-4" />
  }
}

const NotOnPassBadge = () => <Badge variant="outline">Not on pass</Badge>

// A span rather than <Skeleton>, which is a div and so cannot sit inside the
// button that wraps a leg row.
const LoadingBar = ({ className }: { className?: string }) => (
  <span
    className={cn("inline-block animate-pulse rounded-md bg-muted", className)}
  />
)

const LoadFailedAlert = ({
  title,
  children,
}: PropsWithChildren<{ title: string }>) => (
  <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
    <AlertCircleIcon />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{children}</AlertDescription>
  </Alert>
)

const LiveBadge = () => (
  <Badge variant="destructive">
    <RadioIcon data-icon="inline-start" />
    Live
  </Badge>
)

interface CurrentWeatherProps {
  temperature: number
  weatherCode: number
  isDay: boolean
}

const weatherIcon = (weatherCode: number, isDay: boolean) =>
  weatherIcons[weatherCode]?.[isDay ? "day" : "night"]

// Conditions right now, sat beside the place name: the temperature is the
// biggest thing on the card after the place itself.
const CurrentWeather = ({
  temperature,
  weatherCode,
  isDay,
}: CurrentWeatherProps) => {
  const icon = weatherIcon(weatherCode, isDay)

  return (
    <div className="flex items-center gap-1">
      <span className="text-2xl leading-none font-semibold tabular-nums">
        {Math.round(temperature)}°
      </span>
      {icon && (
        <img
          className="size-9 shrink-0"
          src={icon.image}
          alt={icon.description}
        />
      )}
    </div>
  )
}

const forecastDayLabel = (date: string, index: number) => {
  if (index === 0) return "Today"
  if (index === 1) return "Tomorrow"
  return forecastDayFormat.format(new Date(date))
}

const ForecastChip = ({
  label,
  temperature,
  temperatureMin,
  weatherCode,
}: {
  label: string
  temperature: number
  temperatureMin: number
  weatherCode: number
}) => {
  const icon = weatherIcon(weatherCode, true)

  return (
    <div className="flex flex-1 flex-col items-center gap-0.5 rounded-md bg-muted px-1.5 py-1.5">
      <span className="text-xs font-medium">{label}</span>
      <span className="flex items-center gap-1 tabular-nums">
        {icon && (
          <img
            className="size-6 shrink-0"
            src={icon.image}
            alt={icon.description}
          />
        )}
        <span className="text-sm font-semibold">
          {Math.round(temperature)}°
        </span>
        <span className="text-xs text-muted-foreground">
          / {Math.round(temperatureMin)}°
        </span>
      </span>
    </div>
  )
}

interface DestinationProps {
  destination: ManifestDestination
  isCurrent: boolean
}

const Destination = ({ destination, isCurrent }: DestinationProps) => {
  const { data } = $api.useQuery("get", "/weather")
  const now = useNow()

  const weatherReport = data?.find(
    (location) => destination.name == location.destination
  )

  const localTimeFormat = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: destination.timezone,
        hour: "2-digit",
        minute: "2-digit",
      }),
    [destination.timezone]
  )

  return (
    <>
      <Card className={cn(isCurrent && "ring-primary")}>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            {destination.flag} {destination.name}
          </CardTitle>
          <CardDescription className="tabular-nums">
            {destination.country} &middot; {localTimeFormat.format(now)}
          </CardDescription>
          {weatherReport && (
            <CardAction>
              <CurrentWeather
                temperature={weatherReport.current.temperature}
                weatherCode={weatherReport.current.weather_code}
                isDay={weatherReport.current.is_day}
              />
            </CardAction>
          )}
        </CardHeader>
        {weatherReport && (
          <CardContent>
            <div className="flex gap-1.5">
              {weatherReport.daily.map((daily, index) => (
                <ForecastChip
                  key={daily.date}
                  label={forecastDayLabel(daily.date, index)}
                  temperature={daily.temperature_max}
                  temperatureMin={daily.temperature_min}
                  weatherCode={daily.weather_code}
                />
              ))}
            </div>
          </CardContent>
        )}
      </Card>
      {destination.depart && (
        <Marker variant="border" className="mt-4">
          <MarkerContent>
            {departDateFormat.format(new Date(destination.depart))}
          </MarkerContent>
        </Marker>
      )}
    </>
  )
}

// The secondary line under a journey: whatever is known about it, joined with
// dots. Missing parts drop out rather than leaving a dangling separator.
const DetailLine = ({ segments }: { segments: ReactNode[] }) => (
  <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
    {segments.filter(Boolean).map((segment, index) => (
      <Fragment key={index}>
        {index > 0 && <span aria-hidden>&middot;</span>}
        {segment}
      </Fragment>
    ))}
  </span>
)

// Shared by the rail and the board, so a departure reads the same wherever it
// appears.
const DepartureDetails = ({ departure }: { departure: Departure }) => (
  <DetailLine
    segments={[
      departure.line,
      departure.departure.platform && (
        <span className="rounded-sm border px-1 font-medium text-foreground">
          Pl. {departure.departure.platform}
        </span>
      ),
      formatJourneyTime(
        departure.departure.scheduled,
        departure.arrival.scheduled
      ),
      <DelayNote
        scheduled={departure.departure.scheduled}
        expected={departure.departure.actual}
        cancelled={departure.cancelled}
      />,
    ]}
  />
)

interface DepartureSummaryProps {
  departure: Departure | undefined
  isLoading: boolean
  isError: boolean
}

// Line, platform, journey time and status, joined so a missing part never
// leaves a dangling separator behind.
const DepartureSummary = ({
  departure,
  isLoading,
  isError,
}: DepartureSummaryProps) => {
  if (isLoading) return <LoadingBar className="h-4 w-48" />
  if (isError) return <span>Departure information unavailable.</span>
  if (!departure) return <span>No departures found.</span>

  return <DepartureDetails departure={departure} />
}

// Placeholder rows in the shape of the real ones, so the board does not jump
// when the departures land.
const DepartureBoardSkeleton = () => (
  <>
    <span className="sr-only" role="status">
      Loading departures
    </span>
    <ul aria-hidden className="flex flex-col divide-y">
      {Array.from({ length: 5 }, (_, index) => (
        <li key={index} className="grid grid-cols-[auto_1fr] gap-x-3 py-3">
          <LoadingBar className="h-5 w-11" />
          <span className="flex flex-col gap-1.5">
            <LoadingBar className="h-4 w-32" />
            <LoadingBar className="h-3.5 w-48" />
          </span>
        </li>
      ))}
    </ul>
  </>
)

interface DepartureBoardProps {
  departures: Departure[]
  isLoading: boolean
  isError: boolean
}

const DepartureBoard = ({
  departures,
  isLoading,
  isError,
}: DepartureBoardProps) => {
  if (isLoading) return <DepartureBoardSkeleton />

  if (isError) {
    return (
      <LoadFailedAlert title="Failed to load departures">
        This may be a temporary error, please try again in a few moments.
      </LoadFailedAlert>
    )
  }

  if (departures.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        No departures found for this leg.
      </p>
    )
  }

  // One list at every width: the same row the rail uses, so a departure looks
  // the same whether it is on the plan or on the board.
  return (
    <ul className="flex flex-col divide-y">
      {departures.map((departure, index) => (
        <li key={index} className="grid grid-cols-[auto_1fr] gap-x-3 py-3">
          <span
            className={cn(
              "font-semibold whitespace-nowrap tabular-nums",
              departure.cancelled && "text-muted-foreground line-through"
            )}
          >
            <LiveTime
              scheduled={departure.departure.scheduled}
              expected={departure.departure.actual}
            />
          </span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="truncate font-medium">
              {departure.direction ?? "—"}
            </span>
            <span className="text-sm text-muted-foreground">
              <DepartureDetails departure={departure} />
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

// The rail: one hairline running the full height of a row, with the mode icon
// punched over it. Because the line overhangs by exactly the row padding,
// consecutive rows join into a single unbroken line.
const RailNode = ({ mode }: { mode: "train" | "bus" | "plane" }) => (
  <span className="relative flex items-start justify-center self-stretch">
    <span
      aria-hidden
      className="absolute -inset-y-2.5 left-1/2 w-px -translate-x-1/2 bg-border"
    />
    <span className="relative grid size-7 place-items-center rounded-full bg-secondary text-secondary-foreground">
      <TravelIcon mode={mode} />
    </span>
  </span>
)

const railRow =
  "grid w-full grid-cols-[2rem_1fr_auto] items-start gap-x-3 py-2.5"

const RailHeadline = ({ children }: PropsWithChildren) => (
  <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-semibold tabular-nums">
    {children}
  </span>
)

// Flights are static: their times are fixed and there is no board to open, so
// the row is not interactive.
const FlightRow = ({ flight }: { flight: ManifestFlight }) => (
  <div className={railRow}>
    <RailNode mode="plane" />
    <span className="flex min-w-0 flex-col gap-1">
      <RailHeadline>
        <strong>
          {formatZonedTime(flight.departure_at, flight.departure_timezone)}
        </strong>
        <span className="truncate">{flight.end}</span>
        <NotOnPassBadge />
      </RailHeadline>
      <span className="text-sm text-muted-foreground">
        <DetailLine
          segments={[
            flight.number,
            formatJourneyTime(flight.departure_at, flight.arrival_at),
            flight.operator,
          ]}
        />
      </span>
    </span>
  </div>
)

const LegRow = ({ leg }: { leg: ManifestLeg }) => {
  const { data, isError, isLoading, dataUpdatedAt } = useDepartures(leg)

  const nextDeparture = data?.find((departure) => !departure.cancelled)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            railRow,
            "rounded-lg text-left transition-colors outline-none hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          )}
        >
          <RailNode mode={leg.mode} />
          <span className="flex min-w-0 flex-col gap-1">
            <RailHeadline>
              {isLoading ? (
                <LoadingBar className="h-5 w-11" />
              ) : (
                nextDeparture && (
                  <LiveTime
                    scheduled={nextDeparture.departure.scheduled}
                    expected={nextDeparture.departure.actual}
                  />
                )
              )}
              <span className="truncate">{leg.to}</span>
              {leg.mode !== "train" && <NotOnPassBadge />}
            </RailHeadline>
            <span className="text-sm text-muted-foreground">
              <DepartureSummary
                departure={nextDeparture}
                isLoading={isLoading}
                isError={isError}
              />
            </span>
          </span>
          <ChevronRightIcon className="size-4 self-center text-muted-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Departures from {leg.from}</DialogTitle>
          <DialogDescription>
            {isLoading ? (
              "Fetching the latest departures."
            ) : isError ? (
              "The departure board could not be reached."
            ) : (
              <>
                <LiveBadge /> Departure information as of{" "}
                {formatTrainTime(new Date(dataUpdatedAt).toISOString())}.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DepartureBoard
          departures={data?.slice(0, 10) ?? []}
          isLoading={isLoading}
          isError={isError}
        />
      </DialogContent>
    </Dialog>
  )
}

type Journey = ManifestFlight | ManifestLeg

const JourneyRail = ({ journeys }: { journeys: Journey[] }) => (
  <div className="flex flex-col">
    {journeys.map((journey, index) =>
      journey.type === "flight" ? (
        <FlightRow key={index} flight={journey} />
      ) : (
        <LegRow key={index} leg={journey} />
      )
    )}
  </div>
)

// Consecutive flights and legs are one continuous journey between two places,
// so they are drawn as a single rail rather than as separate items.
type PlanBlock =
  | { kind: "destination"; destination: ManifestDestination }
  | { kind: "journeys"; journeys: Journey[] }

// You are at a place until the day you leave it, so where you are now is the
// first destination whose departure date has not passed. The last destination
// has no departure date, which makes it the fallback once the trip is over.
const findCurrentDestination = (items: ManifestItem[]) =>
  items
    .filter((item): item is ManifestDestination => item.type === "destination")
    .find(
      (destination) =>
        !destination.depart ||
        differenceInCalendarDays(destination.depart, new Date()) >= 0
    )

const toPlanBlocks = (items: ManifestItem[]) => {
  const blocks: PlanBlock[] = []

  for (const item of items) {
    if (item.type === "destination") {
      blocks.push({ kind: "destination", destination: item })
      continue
    }

    const previous = blocks.at(-1)
    if (previous?.kind === "journeys") {
      previous.journeys.push(item)
    } else {
      blocks.push({ kind: "journeys", journeys: [item] })
    }
  }

  return blocks
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
      <LoadFailedAlert title="Failed to load travel plan">
        This may be a temporary error, please try again in a few moments.
      </LoadFailedAlert>
    )

  const currentDestination = findCurrentDestination(data ?? [])

  return (
    <div className="flex w-full flex-col gap-4">
      {toPlanBlocks(data ?? []).map((block, index) =>
        block.kind === "destination" ? (
          <Destination
            key={index}
            destination={block.destination}
            isCurrent={block.destination === currentDestination}
          />
        ) : (
          <JourneyRail key={index} journeys={block.journeys} />
        )
      )}
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
