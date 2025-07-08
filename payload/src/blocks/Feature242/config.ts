import { Block } from "payload";

export const Feature242: Block = {
  slug: "feature242",
  interfaceName: "Feature242Block",
  labels: {
    singular: "Feature242",
    plural: "Feature242 Blocks",
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
          defaultValue: "Made for modern UI/UX teams",
          admin: {
            width: "50%",
          },
        },
        {
          name: "description",
          type: "textarea",
          label: "Description",
          defaultValue: "Lorem ipsum dolor sit amet consectetur adipiasicing elit.Lorem ipsum dolor sit amet consectetur seams adipisicing elitLorem ipsum dolor sit amet asdfn asq consectetur adipisicing elit.",
          admin: {
            width: "50%",
          },
        },
      ],
    },
    {
      name: "readMoreText",
      type: "text",
      label: "Read More Text",
      defaultValue: "Read more here",
    },
    {
      name: "items",
      type: "array",
      label: "Carousel Items",
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "title",
              type: "text",
              label: "Item Title",
              required: true,
              admin: {
                width: "50%",
              },
            },
            {
              name: "href",
              type: "text",
              label: "Link URL",
              defaultValue: "#",
              admin: {
                width: "50%",
              },
            },
          ],
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Item Image",
          required: true,
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
          title: "Just Copy Paste ShadCn Blocks",
          href: "#",
          imageUrl: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/illustrations/tokyo-exchange-between-the-user-and-the-global-network.svg",
        },
        {
          title: "Build Modern UI/UX",
          href: "#",
          imageUrl: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/illustrations/tokyo-letters-and-arrows-flying-out-of-a-black-hole.svg",
        },
        {
          title: "Streamline Your Workflow",
          href: "#",
          imageUrl: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/illustrations/tokyo-loading-the-next-page.svg",
        },
        {
          title: "Collaborate Effectively",
          href: "#",
          imageUrl: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/illustrations/tokyo-many-browser-windows-with-different-information.svg",
        },
      ],
    },
  ],
}; 