import { forwardRef } from "react";
import { Box, Flex, IconButton, Typography } from "@strapi/design-system";
import { Cross, Drag } from "@strapi/icons";

export const Item = forwardRef(
  (
    { id, label, style, attributes, listeners, handleDelete, disabled = false },
    ref
  ) => {
    return (
      <Box
        style={style}
        ref={ref}
        background={disabled ? "neutral150" : undefined}
        borderColor={"neutral200"}
        hasRadius={true}
      >
        <Flex gap={1}>
          <IconButton
            icon={<Drag />}
            noBorder={true}
            disabled={disabled}
            {...attributes}
            {...listeners}
          />
          <Typography textColor={disabled ? "neutral600" : undefined}>
            {label}
          </Typography>
          <IconButton
            icon={<Cross />}
            noBorder={true}
            disabled={disabled}
            onClick={() => handleDelete(id)}
          />
        </Flex>
      </Box>
    );
  }
);
