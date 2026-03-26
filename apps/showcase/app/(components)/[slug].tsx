import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { SpotlightButton } from "@/components/animated/spotlight-button";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/components/ui/avatar";
import { Badge } from "@/registry/components/ui/badge";
import { Button } from "@/registry/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/registry/components/ui/card";
import { Input } from "@/registry/components/ui/input";
import { Label } from "@/registry/components/ui/label";
import { Separator } from "@/registry/components/ui/separator";
import { Text } from "@/registry/components/ui/text";
import { Textarea } from "@/registry/components/ui/textarea";

const COMPONENT_META = {
  avatar: { title: "Avatar" },
  badge: { title: "Badge" },
  button: { title: "Button" },
  "spotlight-button": { title: "Spotlight Button" },
  card: { title: "Card" },
  input: { title: "Input" },
  label: { title: "Label" },
  separator: { title: "Separator" },
  text: { title: "Typography" },
  textarea: { title: "Textarea" },
} as const;

type ComponentSlug = keyof typeof COMPONENT_META;

function Block({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      {title ? (
        <CardHeader>
          <Text variant="large">{title}</Text>
        </CardHeader>
      ) : null}
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function ComponentScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState(
    "Ship the preview first, then show each example full width.",
  );
  const [spotlightCount, setSpotlightCount] = useState(0);
  const backgroundColor = useThemeColor({}, "background");
  const primarySurface = useThemeColor(
    { light: "#082f49", dark: "#0f172a" },
    "background",
  );
  const neutralSurface = useThemeColor(
    { light: "#e4e4e7", dark: "#27272a" },
    "background",
  );

  const resolvedSlug = (slug ?? "button") as ComponentSlug;
  const meta = COMPONENT_META[resolvedSlug];

  if (!meta) {
    return (
      <View style={styles.emptyState}>
        <Text variant="h3">Component not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor }]}>
      <Stack.Screen options={{ title: meta.title, headerShown: true }} />
      <ScrollView
        style={[styles.screen, { backgroundColor }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text variant="h1">{meta.title}</Text>
        </View>

        <View style={styles.stackLg}>
          <Text variant="large">Preview</Text>
          {resolvedSlug === "button" && <ButtonPreview />}
          {resolvedSlug === "spotlight-button" && (
            <SpotlightButtonPreview
              count={spotlightCount}
              onPress={() => setSpotlightCount((value) => value + 1)}
              primarySurface={primarySurface}
              neutralSurface={neutralSurface}
            />
          )}
          {resolvedSlug === "input" && (
            <InputPreview
              inputValue={inputValue}
              onChangeText={setInputValue}
            />
          )}
          {resolvedSlug === "textarea" && (
            <TextareaPreview
              value={textareaValue}
              onChangeText={setTextareaValue}
            />
          )}
          {resolvedSlug === "badge" && <BadgePreview />}
          {resolvedSlug === "avatar" && <AvatarPreview />}
          {resolvedSlug === "text" && <TypographyPreview />}
          {resolvedSlug === "card" && <CardPreview />}
          {resolvedSlug === "separator" && <SeparatorPreview />}
          {resolvedSlug === "label" && <LabelPreview />}
        </View>

        <View style={styles.stackXl}>
          {resolvedSlug === "button" && <ButtonExamples />}
          {resolvedSlug === "spotlight-button" && (
            <SpotlightButtonExamples
              count={spotlightCount}
              onPrimaryPress={() => setSpotlightCount((value) => value + 1)}
              onReset={() => setSpotlightCount(0)}
              primarySurface={primarySurface}
              neutralSurface={neutralSurface}
            />
          )}
          {resolvedSlug === "input" && (
            <InputExamples
              inputValue={inputValue}
              onChangeText={setInputValue}
            />
          )}
          {resolvedSlug === "textarea" && (
            <TextareaExamples
              value={textareaValue}
              onChangeText={setTextareaValue}
            />
          )}
          {resolvedSlug === "badge" && <BadgeExamples />}
          {resolvedSlug === "avatar" && <AvatarExamples />}
          {resolvedSlug === "text" && <TypographyExamples />}
          {resolvedSlug === "card" && <CardExamples />}
          {resolvedSlug === "separator" && <SeparatorExamples />}
          {resolvedSlug === "label" && <LabelExamples />}
        </View>
      </ScrollView>
    </View>
  );
}

function SpotlightButtonPreview({
  count,
  onPress,
  primarySurface,
  neutralSurface,
}: {
  count: number;
  onPress: () => void;
  primarySurface: string;
  neutralSurface: string;
}) {
  return (
    <View style={styles.stackMd}>
      <View
        style={[styles.spotlightSurface, { backgroundColor: primarySurface }]}
      >
        <SpotlightButton size="lg" badge="Beta" onPress={onPress}>
          {count === 0
            ? "Launch animation"
            : `Launched ${count} time${count === 1 ? "" : "s"}`}
        </SpotlightButton>
      </View>
      <View
        style={[styles.spotlightSurface, { backgroundColor: neutralSurface }]}
      >
        <SpotlightButton variant="neutral" badge="Update" onPress={onPress}>
          View release notes
        </SpotlightButton>
      </View>
    </View>
  );
}

function SpotlightButtonExamples({
  count,
  onPrimaryPress,
  onReset,
  primarySurface,
  neutralSurface,
}: {
  count: number;
  onPrimaryPress: () => void;
  onReset: () => void;
  primarySurface: string;
  neutralSurface: string;
}) {
  return (
    <>
      <Block title="Interactive hero">
        <View style={styles.stackMd}>
          <Text variant="muted">
            Tap the button to test the shimmer, press state, and live action
            label.
          </Text>
          <View
            style={[
              styles.spotlightSurface,
              { backgroundColor: primarySurface },
            ]}
          >
            <SpotlightButton size="lg" badge="Live" onPress={onPrimaryPress}>
              {count === 0 ? "Start preview build" : `Preview taps ${count}`}
            </SpotlightButton>
          </View>
        </View>
      </Block>
      <Block title="Neutral surface">
        <View style={styles.stackMd}>
          <View
            style={[
              styles.spotlightSurface,
              { backgroundColor: neutralSurface },
            ]}
          >
            <SpotlightButton
              variant="neutral"
              badge="New"
              onPress={onPrimaryPress}
            >
              Open changelog
            </SpotlightButton>
          </View>
          <Button variant="outline" onPress={onReset}>
            <Text>Reset counter</Text>
          </Button>
        </View>
      </Block>
    </>
  );
}

function ButtonPreview() {
  return (
    <View style={styles.stackMd}>
      <View style={styles.rowWrap}>
        <Button>
          <Text>Default</Text>
        </Button>
        <Button variant="secondary">
          <Text>Secondary</Text>
        </Button>
        <Button variant="outline">
          <Text>Outline</Text>
        </Button>
        <Button variant="destructive">
          <Text>Delete</Text>
        </Button>
        <Button variant="ghost">
          <Text>Ghost</Text>
        </Button>
      </View>
      <View style={styles.rowWrap}>
        <Button size="sm">
          <Text>Small</Text>
        </Button>
        <Button size="default">
          <Text>Default</Text>
        </Button>
        <Button size="lg">
          <Text>Large</Text>
        </Button>
        <Button variant="outline" size="icon">
          <Text>+</Text>
        </Button>
      </View>
    </View>
  );
}

function ButtonExamples() {
  return (
    <>
      <Block title="Primary">
        <Button>
          <Text>Create project</Text>
        </Button>
      </Block>
      <Block title="Supporting">
        <View style={styles.rowWrap}>
          <Button variant="secondary">
            <Text>Preview</Text>
          </Button>
          <Button variant="outline">
            <Text>Docs</Text>
          </Button>
          <Button variant="ghost">
            <Text>Skip</Text>
          </Button>
        </View>
      </Block>
      <Block title="States">
        <View style={styles.stackMd}>
          <Button variant="destructive">
            <Text>Delete component</Text>
          </Button>
          <Button disabled>
            <Text>Disabled</Text>
          </Button>
        </View>
      </Block>
    </>
  );
}

function InputPreview({
  inputValue,
  onChangeText,
}: {
  inputValue: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.stackMd}>
      <Input
        placeholder="Email address"
        value={inputValue}
        onChangeText={onChangeText}
      />
      <Input variant="ghost" placeholder="Search components..." />
      <Input editable={false} value="Read only value" />
    </View>
  );
}

function InputExamples({
  inputValue,
  onChangeText,
}: {
  inputValue: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <>
      <Block title="Email">
        <View style={styles.stackMd}>
          <Label>Email</Label>
          <Input
            placeholder="name@example.com"
            value={inputValue}
            onChangeText={onChangeText}
          />
        </View>
      </Block>
      <Block title="Password">
        <View style={styles.stackMd}>
          <Label>Password</Label>
          <Input placeholder="Enter password" secureTextEntry />
        </View>
      </Block>
    </>
  );
}

function TextareaPreview({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.stackMd}>
      <Textarea value={value} onChangeText={onChangeText} />
      <Textarea
        variant="ghost"
        placeholder="Drop in a draft or meeting notes..."
      />
    </View>
  );
}

function TextareaExamples({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <>
      <Block title="Default">
        <Textarea value={value} onChangeText={onChangeText} />
      </Block>
      <Block title="Readonly">
        <Textarea
          editable={false}
          value="This project has been archived and is no longer editable."
        />
      </Block>
    </>
  );
}

function BadgePreview() {
  return (
    <View style={styles.rowWrap}>
      <Badge>
        <Text>New</Text>
      </Badge>
      <Badge variant="secondary">
        <Text>Beta</Text>
      </Badge>
      <Badge variant="outline">
        <Text>Draft</Text>
      </Badge>
      <Badge variant="destructive">
        <Text>Blocked</Text>
      </Badge>
    </View>
  );
}

function BadgeExamples() {
  return (
    <>
      <Block title="Status">
        <View style={styles.rowWrap}>
          <Badge>
            <Text>Published</Text>
          </Badge>
          <Badge variant="secondary">
            <Text>Internal</Text>
          </Badge>
          <Badge variant="outline">
            <Text>Review</Text>
          </Badge>
          <Badge variant="destructive">
            <Text>Deprecated</Text>
          </Badge>
        </View>
      </Block>
      <Block title="Metadata">
        <View style={styles.rowWrap}>
          <Badge variant="outline">
            <Text>@watermelon/registry</Text>
          </Badge>
          <Badge variant="secondary">
            <Text>9 primitives</Text>
          </Badge>
        </View>
      </Block>
    </>
  );
}

function AvatarPreview() {
  return (
    <View style={styles.avatarRow}>
      <Avatar alt="shadcn avatar">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>
          <Text variant="small">SC</Text>
        </AvatarFallback>
      </Avatar>
      <Avatar alt="JD avatar">
        <AvatarFallback>
          <Text variant="small">JD</Text>
        </AvatarFallback>
      </Avatar>
      <Avatar alt="XL avatar" className="h-16 w-16">
        <AvatarFallback>
          <Text>XL</Text>
        </AvatarFallback>
      </Avatar>
    </View>
  );
}

function AvatarExamples() {
  return (
    <>
      <Block title="Fallbacks">
        <View style={styles.avatarRow}>
          <Avatar alt="Designer">
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>
              <Text variant="small">PD</Text>
            </AvatarFallback>
          </Avatar>
          <Avatar alt="Engineer">
            <AvatarFallback>
              <Text variant="small">EN</Text>
            </AvatarFallback>
          </Avatar>
        </View>
      </Block>
      <Block title="Sizes">
        <View style={styles.avatarRow}>
          <Avatar className="h-10 w-10" alt="Small">
            <AvatarFallback>
              <Text variant="small">SM</Text>
            </AvatarFallback>
          </Avatar>
          <Avatar className="h-14 w-14" alt="Medium">
            <AvatarFallback>
              <Text>MD</Text>
            </AvatarFallback>
          </Avatar>
          <Avatar className="h-20 w-20" alt="Large">
            <AvatarFallback>
              <Text>LG</Text>
            </AvatarFallback>
          </Avatar>
        </View>
      </Block>
    </>
  );
}

function TypographyPreview() {
  return (
    <View style={styles.stackMd}>
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="lead">Lead text</Text>
      <Text variant="small">Small label</Text>
      <Text variant="code">registry add text</Text>
    </View>
  );
}

function TypographyExamples() {
  return (
    <>
      <Block title="Headings">
        <View style={styles.stackMd}>
          <Text variant="h1">Design System</Text>
          <Text variant="h2">Foundations</Text>
          <Text variant="h3">Components</Text>
          <Text variant="h4">Buttons</Text>
        </View>
      </Block>
      <Block title="Body">
        <View style={styles.stackMd}>
          <Text variant="lead">Lead text for section intros.</Text>
          <Text variant="p">
            Paragraph text for longer product explanation.
          </Text>
          <Text variant="muted">Muted helper copy.</Text>
          <Text variant="small">Small labels.</Text>
        </View>
      </Block>
    </>
  );
}

function CardPreview() {
  return (
    <Card>
      <CardHeader>
        <Text variant="large">Starter Card</Text>
      </CardHeader>
      <CardContent>
        <Text>Use the content slot for the main body.</Text>
      </CardContent>
      <CardFooter style={styles.footerEnd}>
        <Button size="sm">
          <Text>Action</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}

function CardExamples() {
  return (
    <>
      <Block title="Product">
        <Card>
          <CardHeader>
            <Text variant="large">Watermelon Pro</Text>
          </CardHeader>
          <CardContent style={styles.stackMd}>
            <Text>
              Includes shared primitives, docs, and a live showcase app.
            </Text>
            <View style={styles.badgeWrap}>
              <Badge variant="secondary">
                <Text>Popular</Text>
              </Badge>
            </View>
          </CardContent>
          <CardFooter style={styles.footerGapEnd}>
            <Button variant="ghost" size="sm">
              <Text>Later</Text>
            </Button>
            <Button size="sm">
              <Text>Upgrade</Text>
            </Button>
          </CardFooter>
        </Card>
      </Block>
      <Block title="Metrics">
        <Card>
          <CardHeader>
            <Text variant="large">Weekly usage</Text>
          </CardHeader>
          <CardContent style={styles.stackLg}>
            <View style={styles.rowBetween}>
              <Text>Components shipped</Text>
              <Text variant="large">12</Text>
            </View>
            <Separator />
            <View style={styles.rowBetween}>
              <Text>Open feedback items</Text>
              <Text variant="large">4</Text>
            </View>
          </CardContent>
        </Card>
      </Block>
    </>
  );
}

function SeparatorPreview() {
  return (
    <View style={styles.stackLg}>
      <Separator />
      <View style={styles.separatorRow}>
        <Text>Left</Text>
        <Separator
          orientation="vertical"
          style={styles.verticalSeparatorTall}
        />
        <Text>Center</Text>
        <Separator
          orientation="vertical"
          style={styles.verticalSeparatorTall}
        />
        <Text>Right</Text>
      </View>
    </View>
  );
}

function SeparatorExamples() {
  return (
    <>
      <Block title="List">
        <View style={styles.stackMd}>
          <Text>Profile</Text>
          <Separator />
          <Text>Notifications</Text>
          <Separator />
          <Text>Billing</Text>
        </View>
      </Block>
      <Block title="Inline">
        <View style={styles.separatorRow}>
          <Text>Overview</Text>
          <Separator
            orientation="vertical"
            style={styles.verticalSeparatorShort}
          />
          <Text>Activity</Text>
          <Separator
            orientation="vertical"
            style={styles.verticalSeparatorShort}
          />
          <Text>Settings</Text>
        </View>
      </Block>
    </>
  );
}

function LabelPreview() {
  return (
    <View style={styles.stackLg}>
      <View style={styles.stackSm}>
        <Label>Email</Label>
        <Input placeholder="team@watermelon.dev" />
      </View>
      <View style={styles.stackSm}>
        <Label>Password</Label>
        <Input secureTextEntry placeholder="Enter a secure password" />
      </View>
    </View>
  );
}

function LabelExamples() {
  return (
    <>
      <Block title="Form">
        <View style={styles.stackLg}>
          <View style={styles.stackSm}>
            <Label>Display name</Label>
            <Input placeholder="Watermelon UI" />
          </View>
          <View style={styles.stackSm}>
            <Label>Project description</Label>
            <Textarea placeholder="Describe what this project is for..." />
          </View>
        </View>
      </Block>
      <Block title="Readonly">
        <View style={styles.stackSm}>
          <Label>API key</Label>
          <Input value="wm_live_••••••••••" editable={false} />
        </View>
      </Block>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    gap: 32,
    padding: 20,
    paddingBottom: 56,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  hero: {
    gap: 8,
    paddingTop: 4,
  },
  badgeWrap: {
    alignSelf: "flex-start",
  },
  stackSm: {
    gap: 10,
  },
  stackMd: {
    gap: 14,
  },
  stackLg: {
    gap: 18,
  },
  stackXl: {
    gap: 22,
  },
  spotlightSurface: {
    borderRadius: 20,
    padding: 20,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  avatarRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 18,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerEnd: {
    justifyContent: "flex-end",
  },
  footerGapEnd: {
    gap: 12,
    justifyContent: "flex-end",
  },
  separatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  verticalSeparatorTall: {
    height: 32,
  },
  verticalSeparatorShort: {
    height: 24,
  },
});
