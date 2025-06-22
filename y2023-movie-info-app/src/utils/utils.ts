export const makeImagePath = (
  image: string | undefined,
  width: string = "w500"
) => {
  return `...`;
};

export const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};

export const obscureEmailDomain = (email: string) => {
  const [localPart, domainPart] = email.split("@");
  const obscuredLocalPart =
    localPart.length > 2
      ? localPart.substring(0, 2) + "*".repeat(localPart.length - 2)
      : localPart;

  if (domainPart) {
    const domainSections = domainPart.split(".");
    const obscuredDomain = domainSections
      .map((section, index) => {
        if (index === 0) {
          return section.charAt(0) + "*".repeat(section.length - 1);
        }
        return section;
      })
      .join(".");
    return `${obscuredLocalPart}@${obscuredDomain}`;
  }

  return email;
};
