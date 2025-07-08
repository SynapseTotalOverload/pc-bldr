import { Block } from "payload";

export const Feature251: Block = {
  slug: "feature251",
  interfaceName: "Feature251Block",
  labels: {
    singular: "Feature251",
    plural: "Feature251 Blocks",
  },
  fields: [
    {
      name: "blockName",
      type: "text",
      label: "Block Name",
    },
    // Card 1 - Customizable Workflows
    {
      name: "card1",
      type: "group",
      label: "Card 1 - Workflows (Large)",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "title",
              type: "text",
              label: "Title",
              defaultValue: "Customizable Workflows",
              admin: {
                width: "60%",
              },
            },
            {
              name: "enabled",
              type: "checkbox",
              label: "Enable Card",
              defaultValue: true,
              admin: {
                width: "40%",
              },
            },
          ],
        },
        {
          name: "description",
          type: "textarea",
          label: "Description",
          defaultValue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt Lorem ipsum dolor sit amet, consectetur",
        },
        {
          name: "icons",
          type: "group",
          label: "Animation Icons (4 required)",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "icon1",
                  type: "select",
                  label: "Icon 1 (Left Top)",
                  defaultValue: "cpu",
                  options: [
                    {
                      label: "Google",
                      value: "google",
                    },
                    {
                      label: "Figma",
                      value: "figma",
                    },
                    {
                      label: "Notion",
                      value: "notion",
                    },
                    {
                      label: "G2",
                      value: "g2",
                    },
                    {
                      label: "Block Icon",
                      value: "block",
                    },
                    {
                      label: "CPU",
                      value: "cpu",
                    },
                    {
                      label: "GPU / Video Card",
                      value: "gpu",
                    },
                    {
                      label: "Motherboard",
                      value: "motherboard",
                    },
                    {
                      label: "Memory / RAM",
                      value: "memory",
                    },
                    {
                      label: "Storage / HDD",
                      value: "storage",
                    },
                    {
                      label: "Power Supply",
                      value: "power-supply",
                    },
                    {
                      label: "Case",
                      value: "case",
                    },
                    {
                      label: "CPU Cooler",
                      value: "cpu-cooler",
                    },
                  ],
                  admin: {
                    width: "50%",
                  },
                },
                {
                  name: "icon2",
                  type: "select",
                  label: "Icon 2 (Center)",
                  defaultValue: "gpu",
                  options: [
                    {
                      label: "Google",
                      value: "google",
                    },
                    {
                      label: "Figma",
                      value: "figma",
                    },
                    {
                      label: "Notion",
                      value: "notion",
                    },
                    {
                      label: "G2",
                      value: "g2",
                    },
                    {
                      label: "Block Icon",
                      value: "block",
                    },
                    {
                      label: "CPU",
                      value: "cpu",
                    },
                    {
                      label: "GPU / Video Card",
                      value: "gpu",
                    },
                    {
                      label: "Motherboard",
                      value: "motherboard",
                    },
                    {
                      label: "Memory / RAM",
                      value: "memory",
                    },
                    {
                      label: "Storage / HDD",
                      value: "storage",
                    },
                    {
                      label: "Power Supply",
                      value: "power-supply",
                    },
                    {
                      label: "Case",
                      value: "case",
                    },
                    {
                      label: "CPU Cooler",
                      value: "cpu-cooler",
                    },
                  ],
                  admin: {
                    width: "50%",
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "icon3",
                  type: "select",
                  label: "Icon 3 (Left Bottom)",
                  defaultValue: "motherboard",
                  options: [
                    {
                      label: "Google",
                      value: "google",
                    },
                    {
                      label: "Figma",
                      value: "figma",
                    },
                    {
                      label: "Notion",
                      value: "notion",
                    },
                    {
                      label: "G2",
                      value: "g2",
                    },
                    {
                      label: "Block Icon",
                      value: "block",
                    },
                    {
                      label: "CPU",
                      value: "cpu",
                    },
                    {
                      label: "GPU / Video Card",
                      value: "gpu",
                    },
                    {
                      label: "Motherboard",
                      value: "motherboard",
                    },
                    {
                      label: "Memory / RAM",
                      value: "memory",
                    },
                    {
                      label: "Storage / HDD",
                      value: "storage",
                    },
                    {
                      label: "Power Supply",
                      value: "power-supply",
                    },
                    {
                      label: "Case",
                      value: "case",
                    },
                    {
                      label: "CPU Cooler",
                      value: "cpu-cooler",
                    },
                  ],
                  admin: {
                    width: "50%",
                  },
                },
                {
                  name: "icon4",
                  type: "select",
                  label: "Icon 4 (Right Output)",
                  defaultValue: "memory",
                  options: [
                    {
                      label: "Google",
                      value: "google",
                    },
                    {
                      label: "Figma",
                      value: "figma",
                    },
                    {
                      label: "Notion",
                      value: "notion",
                    },
                    {
                      label: "G2",
                      value: "g2",
                    },
                    {
                      label: "Block Icon",
                      value: "block",
                    },
                    {
                      label: "CPU",
                      value: "cpu",
                    },
                    {
                      label: "GPU / Video Card",
                      value: "gpu",
                    },
                    {
                      label: "Motherboard",
                      value: "motherboard",
                    },
                    {
                      label: "Memory / RAM",
                      value: "memory",
                    },
                    {
                      label: "Storage / HDD",
                      value: "storage",
                    },
                    {
                      label: "Power Supply",
                      value: "power-supply",
                    },
                    {
                      label: "Case",
                      value: "case",
                    },
                    {
                      label: "CPU Cooler",
                      value: "cpu-cooler",
                    },
                  ],
                  admin: {
                    width: "50%",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    // Card 2 - Smart Task Tracking
    {
      name: "card2",
      type: "group",
      label: "Card 2 - Task Tracking",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "title",
              type: "text",
              label: "Title",
              defaultValue: "Smart Task Tracking",
              admin: {
                width: "60%",
              },
            },
            {
              name: "enabled",
              type: "checkbox",
              label: "Enable Card",
              defaultValue: true,
              admin: {
                width: "40%",
              },
            },
          ],
        },
        {
          name: "description",
          type: "textarea",
          label: "Description",
          defaultValue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
        },
        {
          name: "icons",
          type: "group",
          label: "Animation Icons (2 required)",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "topIcon",
                  type: "select",
                  label: "Top Icon",
                  defaultValue: "storage",
                  options: [
                    {
                      label: "Google",
                      value: "google",
                    },
                    {
                      label: "Figma",
                      value: "figma",
                    },
                    {
                      label: "Notion",
                      value: "notion",
                    },
                    {
                      label: "G2",
                      value: "g2",
                    },
                    {
                      label: "Block Icon",
                      value: "block",
                    },
                    {
                      label: "CPU",
                      value: "cpu",
                    },
                    {
                      label: "GPU / Video Card",
                      value: "gpu",
                    },
                    {
                      label: "Motherboard",
                      value: "motherboard",
                    },
                    {
                      label: "Memory / RAM",
                      value: "memory",
                    },
                    {
                      label: "Storage / HDD",
                      value: "storage",
                    },
                    {
                      label: "Power Supply",
                      value: "power-supply",
                    },
                    {
                      label: "Case",
                      value: "case",
                    },
                    {
                      label: "CPU Cooler",
                      value: "cpu-cooler",
                    },
                  ],
                  admin: {
                    width: "50%",
                  },
                },
                {
                  name: "bottomIcon",
                  type: "select",
                  label: "Bottom Icon",
                  defaultValue: "power-supply",
                  options: [
                    {
                      label: "Google",
                      value: "google",
                    },
                    {
                      label: "Figma",
                      value: "figma",
                    },
                    {
                      label: "Notion",
                      value: "notion",
                    },
                    {
                      label: "G2",
                      value: "g2",
                    },
                    {
                      label: "Block Icon",
                      value: "block",
                    },
                    {
                      label: "CPU",
                      value: "cpu",
                    },
                    {
                      label: "GPU / Video Card",
                      value: "gpu",
                    },
                    {
                      label: "Motherboard",
                      value: "motherboard",
                    },
                    {
                      label: "Memory / RAM",
                      value: "memory",
                    },
                    {
                      label: "Storage / HDD",
                      value: "storage",
                    },
                    {
                      label: "Power Supply",
                      value: "power-supply",
                    },
                    {
                      label: "Case",
                      value: "case",
                    },
                    {
                      label: "CPU Cooler",
                      value: "cpu-cooler",
                    },
                  ],
                  admin: {
                    width: "50%",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    // Card 3 - Seamless Integration
    {
      name: "card3",
      type: "group",
      label: "Card 3 - Integration",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "title",
              type: "text",
              label: "Title",
              defaultValue: "Seamless Integration & Real-Time Collaboration",
              admin: {
                width: "60%",
              },
            },
            {
              name: "enabled",
              type: "checkbox",
              label: "Enable Card",
              defaultValue: true,
              admin: {
                width: "40%",
              },
            },
          ],
        },
        {
          name: "description",
          type: "textarea",
          label: "Description",
          defaultValue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
        },
        {
          name: "image",
          type: "select",
          label: "Card Image",
          defaultValue: "case",
          options: [
            {
              label: "Google",
              value: "google",
            },
            {
              label: "Figma",
              value: "figma",
            },
            {
              label: "Notion",
              value: "notion",
            },
            {
              label: "G2",
              value: "g2",
            },
            {
              label: "Block Icon",
              value: "block",
            },
            {
              label: "CPU",
              value: "cpu",
            },
            {
              label: "GPU / Video Card",
              value: "gpu",
            },
            {
              label: "Motherboard",
              value: "motherboard",
            },
            {
              label: "Memory / RAM",
              value: "memory",
            },
            {
              label: "Storage / HDD",
              value: "storage",
            },
            {
              label: "Power Supply",
              value: "power-supply",
            },
            {
              label: "Case",
              value: "case",
            },
            {
              label: "CPU Cooler",
              value: "cpu-cooler",
            },
          ],
        },
      ],
    },
    // Card 4 - Trusted by Users
    {
      name: "card4",
      type: "group",
      label: "Card 4 - User Trust (Large)",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "title",
              type: "text",
              label: "Title",
              defaultValue: "Trusted by 100k Users",
              admin: {
                width: "60%",
              },
            },
            {
              name: "enabled",
              type: "checkbox",
              label: "Enable Card",
              defaultValue: true,
              admin: {
                width: "40%",
              },
            },
          ],
        },
        {
          name: "description",
          type: "textarea",
          label: "Description",
          defaultValue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt Lorem ipsum dolor sit amet, consectetur",
        },
      ],
    },
  ],
}; 