import { View, ScrollView, Pressable } from "react-native";
import { Link } from "expo-router";
import { Text } from "@/registry/components/ui/text";
import { IconSymbol } from "@/components/ui/icon-symbol";

const CATEGORIES = [
  { id: "button", name: "Button", icon: "square.and.pencil" as const },
  {
    id: "spotlight-button",
    name: "Spotlight Button",
    icon: "sparkles" as const,
  },
  { id: "input", name: "Input", icon: "keyboard" as const },
  { id: "textarea", name: "Textarea", icon: "note.text" as const },
  { id: "badge", name: "Badge", icon: "app.badge" as const },
  { id: "avatar", name: "Avatar", icon: "person.circle" as const },
  { id: "card", name: "Card", icon: "rectangle.stack.fill" as const },
  { id: "separator", name: "Separator", icon: "rectangle.split.3x1" as const },
  { id: "label", name: "Label", icon: "tag.fill" as const },
  { id: "text", name: "Typography", icon: "textformat" as const },
];

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingTop: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8">
          <Text variant="h1" className="text-3xl font-extrabold">
            Watermelon RN
          </Text>
          <Text variant="muted" className="mt-1">
            shadcn-like components for React Native
          </Text>
        </View>

        <Text variant="h3" className="mb-4">
          Components
        </Text>

        <View className="gap-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/(components)/${category.id}`}
              asChild
            >
              <Pressable className="flex-row items-center justify-between rounded-xl border border-border bg-card p-4 active:bg-secondary/50">
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconSymbol
                      name={category.icon}
                      size={20}
                      className="text-primary"
                    />
                  </View>
                  <Text className="text-lg font-medium">{category.name}</Text>
                </View>
                <IconSymbol
                  name="chevron.right"
                  size={16}
                  className="text-muted-foreground"
                />
              </Pressable>
            </Link>
          ))}
        </View>

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
