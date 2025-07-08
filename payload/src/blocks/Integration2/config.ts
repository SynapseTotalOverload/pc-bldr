import { Block } from "payload";
import { link } from "@/fields/link";

export const Integration2: Block = {
  slug: "integration2",
  interfaceName: "Integration2Block",
  labels: {
    singular: "Integration2",
    plural: "Integration2 Blocks",
  },
  fields: [
    {
      name: "blockName",
      type: "text",
      label: "Block Name",
    },
    {
      type: "row",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Title",
          defaultValue: "Powering the world's best product teams",
          admin: {
            width: "50%",
          },
        },
        {
          name: "subtitle",
          type: "text",
          label: "Subtitle",
          defaultValue: "From next-gen startups to established enterprises",
          admin: {
            width: "50%",
          },
        },
      ],
    },
    link({
      overrides: {
        name: "buttonLink",
        label: "Button Link",
      },
    }),
  ],
}; 