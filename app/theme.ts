import {
  Checkbox,
  defaultVariantColorsResolver,
  MantineTheme,
  MantineThemeColorsOverride,
  MantineThemeOverride,
  parseThemeColor,
  rem,
  SelectProps,
  TextInputProps,
} from "@mantine/core";

export const colors = {
  green: [
    "#F0FDF4",
    "#DCFCE7",
    "#BBF7D0",
    "#86EFAC",
    "#4ADE80",
    "#22C55E",
    "#16A34A",
    "#15803D",
    "#166534",
    "#14532D",
    "#052E16",
  ],
  emerald: [
    "#ECFDF5",
    "#D1FAE5",
    "#A7F3D0",
    "#6EE7B7",
    "#34D399",
    "#10B981",
    "#059669",
    "#047857",
    "#065F46",
    "#064E3B",
    "#022C22",
  ],
  teal: [
    "#F0FDFA",
    "#CCFBF1",
    "#99F6E4",
    "#5EEAD4",
    "#2DD4BF",
    "#14B8A6",
    "#0D9488",
    "#0F766E",
    "#115E59",
    "#134E4A",
    "#042F2E",
  ],
  gray: [
    "#F8FAFC",
    "#F1F5F9",
    "#E2E8F0",
    "#CBD5E1",
    "#94A3B8",
    "#64748B",
    "#475569",
    "#334155",
    "#1E293B",
    "#0F172A",
    "#020617",
  ],
  blue: [
    "#ECFEFF",
    "#CFFAFE",
    "#A5F3FC",
    "#67E8F9",
    "#22D3EE",
    "#06B6D4",
    "#0891B2",
    "#0E7490",
    "#155E75",
    "#164E63",
    "#083344",
  ],
  orange: [
    "#FFF7ED",
    "#FFEDD5",
    "#FED7AA",
    "#FDBA74",
    "#FB923C",
    "#F97316",
    "#EA580C",
    "#C2410C",
    "#9A3412",
    "#7C2D12",
    "#431407",
  ],
  purple: [
    "#F5F3FF",
    "#EDE9FE",
    "#DDD6FE",
    "#C4B5FD",
    "#A78BFA",
    "#8B5CF6",
    "#7C3AED",
    "#6D28D9",
    "#5B21B6",
    "#4C1D95",
    "#2E1065",
  ],
  yellow: [
    "#FFFBEB",
    "#FEF3C7",
    "#FDE68A",
    "#FCD34D",
    "#FBBF24",
    "#F59E0B",
    "#D97706",
    "#B45309",
    "#92400E",
    "#78350F",
    "#451A03",
  ],
} as const;

export type Color = keyof typeof colors;

export const theme: MantineThemeOverride = {
  // Colors
  colors: colors as MantineThemeColorsOverride,
  primaryColor: "green",
  black: colors.gray[8],

  fontFamily: '"DM Sans", sans-serif',
  headings: { fontFamily: "DM Sans, sans-serif" },

  fontSizes: {
    xxs: rem(11),
    xxl: rem(24),
  },

  lineHeights: {
    xxs: "1.2",
  },

  radius: { sm: rem(6) },

  variantColorResolver: (input) => {
    const defaultResolvedColors = defaultVariantColorsResolver(input);
    const parsedColor = parseThemeColor({
      color: input.color || input.theme.primaryColor,
      theme: input.theme,
    });
    const currentColor = parsedColor.color as Color;

    // Adding this variant for CSRD BooleanQuestion
    if (input.variant === "outlight") {
      return {
        background: colors[currentColor][0],
        hover: colors[currentColor][1],
        color: colors.gray[8],
        border: `1px solid ${colors[currentColor][6]}`,
      };
    }

    return defaultResolvedColors;
  },

  components: {
    Text: {
      defaultProps: { size: "sm", colors: colors.gray[8] },
    },
    Button: {
      defaultProps: { size: "md" },
      styles: {
        root: { paddingInline: 16 },
        label: {
          fontSize: 14,
          fontWeight: 500,
        },
      },
    },
    TextInput: {
      styles: (theme: MantineTheme, props: TextInputProps) => ({
        label: { marginBottom: 4 },
        input: {
          height: 42,
          borderColor:
            props.variant === "unstyled" ? "transparent" : theme.colors.gray[2],
        },
      }),
    },
    Textarea: {
      defaultProps: {
        minRows: 2,
        autosize: true,
        resize: "vertical",
      },
      styles: {
        input: { borderColor: colors.gray[2] },
      },
    },
    Select: {
      styles: (theme: MantineTheme, props: SelectProps) => ({
        input: {
          // TODO: not ideal. Probably worth overriding variants instead
          height: props.size === "md" ? 42 : "inherit",
          borderColor:
            props.variant === "unstyled" ? "transparent" : theme.colors.gray[2],
        },
      }),
    },
    ThemeIcon: {
      defaultProps: { variant: "white" },
      styles: {
        root: { background: "transparent" },
      },
    },
    Checkbox: {
      styles: { input: { cursor: "pointer" }, label: { cursor: "pointer" } },
    },
    Table: {
      defaultProps: { borderColor: "gray.2" },
      styles: {
        tfoot: {
          borderTop: `${rem(1)} solid var(--table-border-color)`,
        },
      },
    },
    Modal: {
      styles: {
        title: {
          fontSize: 24,
          fontWeight: 600,
        },
        header: {
          padding: 24,
        },
      },
    },
    Pill: {
      styles: {
        root: {
          background: colors.purple[1],
          color: colors.purple[8],
          paddingTop: 1,
          paddingBottom: 1,
          height: 24,
        },
      },
    },
    HoverCard: {
      styles: {
        dropdown: {
          backgroundColor: colors.gray[8],
          color: colors.gray[1],
          paddingX: 16,
          paddingY: 8,
        },
      },
    },
    Dialog: {
      defaultProps: {
        radius: "md",
        shadow: "xl",
        p: 0,
        mih: 0,
        size: "auto",
        withBorder: true,
      },
    },
    List: {
      defaultProps: { listStyleType: "none" },
      styles: {
        itemWrapper: {
          width: "100%",
        },
        itemLabel: {
          width: "100%",
        },
      },
    },
  },
};
