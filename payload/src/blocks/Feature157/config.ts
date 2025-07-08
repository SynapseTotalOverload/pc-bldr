import { Block } from "payload";
import { link } from "@/fields/link";

export const Feature157: Block = {
  slug: "feature157",
  interfaceName: "Feature157Block",
  labels: {
    singular: "Feature157",
    plural: "Feature157 Blocks",
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
          name: "subtitle",
          type: "text",
          label: "Subtitle",
          defaultValue: "Services",
          admin: {
            width: "30%",
          },
        },
        {
          name: "title",
          type: "text",
          label: "Main Title",
          defaultValue: "Our customers get results and save time",
          admin: {
            width: "70%",
          },
        },
      ],
    },
    {
      name: "cards",
      type: "array",
      label: "Service Cards (exactly 2 required)",
      minRows: 2,
      maxRows: 2,
      admin: {
        initCollapsed: false,
        description: "You must provide exactly 2 service cards",
      },
      fields: [
        {
          name: "title",
          type: "text",
          label: "Card Title",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
          label: "Card Description",
          required: true,
        },
        link({
          appearances: false,
          disableLabel: true,
          overrides: {
            name: "link",
            label: "Card Link (optional)",
            admin: {
              description: "Choose to link to an existing page or enter a custom URL. Leave empty to disable link functionality.",
            },
          },
        }),
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Card Image",
        },
        {
          name: "imageUrl",
          type: "text",
          label: "External Image URL (fallback)",
          admin: {
            description: "Used if no media image is selected",
          },
        },
      ],
      defaultValue: [
        {
          title: "First Service",
          description: "Description for your first service offering.",
          imageUrl: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-9jsQcDsxyqA-unsplash.jpg",
          link: {
            type: "custom",
            url: "#",
            newTab: false,
          },
        },
        {
          title: "Second Service", 
          description: "Description for your second service offering.",
          imageUrl: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-uR__S5GX8Io-unsplash.jpg",
        },
      ],
    },
  ],
}; 