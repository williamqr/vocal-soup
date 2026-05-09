// src/lib/useFonts.ts — load CIPHER's three voices + Chinese shadow
import { useFonts as useExpoFonts } from "expo-font";
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from "@expo-google-fonts/instrument-serif";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
} from "@expo-google-fonts/jetbrains-mono";
import {
  NotoSansSC_400Regular,
  NotoSansSC_700Bold,
} from "@expo-google-fonts/noto-sans-sc";

export function useCipherFonts(): boolean {
  const [loaded] = useExpoFonts({
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    NotoSansSC_400Regular,
    NotoSansSC_700Bold,
  });
  return loaded;
}
