<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the duolingo-clone Expo app. Here is a summary of all changes made:

- **Installed** `posthog-react-native` and its peer dependencies (`expo-file-system`, `expo-application`, `expo-device`, `expo-localization`) via npm.
- **Converted** `app.json` → `app.config.js` to support the `extra` field, which passes `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` into the app via `expo-constants`.
- **Created** `src/config/posthog.ts` — PostHog client singleton configured from `expo-constants` with batching, retries, lifecycle events, and debug mode in dev.
- **Updated** `src/app/_layout.tsx` — wrapped the app in `PostHogProvider` (with autocapture for touch events), and added manual screen tracking via `usePathname`/`useEffect`.
- **Updated** `src/app/(auth)/sign-in.tsx` — added `posthog.identify()` on successful email OTP sign-in; captures `user_signed_in` and `user_signed_in_via_sso` events.
- **Updated** `src/app/(auth)/sign-up.tsx` — added `posthog.identify()` on successful sign-up; captures `user_signed_up` and `user_signed_up_via_sso` events.
- **Updated** `src/app/language-select.tsx` — captures `language_selected` (with `language_code` and `language_name` properties) when user confirms.
- **Updated** `src/app/(tabs)/index.tsx` — captures `lesson_continued` and `ai_video_call_started` when users tap the respective buttons.

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User completes email OTP sign-in | `src/app/(auth)/sign-in.tsx` |
| `user_signed_in_via_sso` | User initiates SSO sign-in (Google/Facebook/Apple) | `src/app/(auth)/sign-in.tsx` |
| `user_signed_up` | User completes account creation and email verification | `src/app/(auth)/sign-up.tsx` |
| `user_signed_up_via_sso` | User initiates SSO sign-up (Google/Facebook/Apple) | `src/app/(auth)/sign-up.tsx` |
| `language_selected` | User confirms their language selection (key funnel step) | `src/app/language-select.tsx` |
| `lesson_continued` | User taps Continue to resume learning on the home screen | `src/app/(tabs)/index.tsx` |
| `ai_video_call_started` | User taps the video call button to start an AI teacher session | `src/app/(tabs)/index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1603283)
- [New Sign-ups (last 30 days)](/insights/wxHXad0O) — daily unique sign-ups
- [Sign-ins over time](/insights/jMv8KhUh) — email vs SSO sign-ins
- [Onboarding conversion funnel](/insights/Svj6bhkY) — sign-up → language selected → lesson continued
- [Language selection breakdown](/insights/NW2Bdp8A) — which languages users pick
- [Learning engagement events](/insights/OYFEKvd4) — lesson continued & AI video calls over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
