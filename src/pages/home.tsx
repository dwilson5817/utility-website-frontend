import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item.tsx"
import { ChevronRightIcon } from "lucide-react"
import { Link } from "react-router"

const tools = [
  {
    title: "Europe Trip",
    subtitle: "Travel Itinerary",
    description: "Simple travel itinerary for interrailing Summer 2026",
    link: "/europe",
  },
]

const HomePage = () => {
  return (
    <div className="mx-auto max-w-4xl">
      <ItemGroup className="grid grid-cols-2 gap-4">
        {tools.map((tool) => (
          <Item key={tool.title} variant="outline" asChild role="listitem">
            <Link to={tool.link}>
              <ItemContent>
                <ItemTitle className="line-clamp-1">
                  {tool.title} -{" "}
                  <span className="text-muted-foreground">{tool.subtitle}</span>
                </ItemTitle>
                <ItemDescription>{tool.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRightIcon className="size-4" />
              </ItemActions>
            </Link>
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}

export default HomePage
