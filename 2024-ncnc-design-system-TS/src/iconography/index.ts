import type {
  NdsCdnUrl,
  NdsCoreIconography,
  NdsIconColor,
  NdsIconGroup,
  NdsIconName,
} from "../lib/types/iconography";
import { getIconUriFromName } from "../lib/utils/iconography";
import { graphicIcons } from "./graphic";
import { navigationIcons } from "./navigation";
import { systemIcons } from "./system";

const iconMap = {
  system: systemIcons,
  navigation: navigationIcons,
  graphic: graphicIcons,
};

const iconData = Object.entries(iconMap).flatMap(([group, icons]) =>
  Object.entries(icons).flatMap(([name, colors]) =>
    colors.map(
      (color: NdsIconColor<NdsIconGroup, NdsIconName<NdsIconGroup>>) => [
        `${group}/${name}/${color}`,
        getIconUriFromName(
          group as NdsIconGroup,
          name as NdsIconName<NdsIconGroup>,
          color as NdsIconColor<NdsIconGroup, NdsIconName<NdsIconGroup>>
        ),
      ]
    )
  )
) as Array<[string, NdsCdnUrl]>;

export const iconography: NdsCoreIconography = new Map(iconData);
