const useIsRTLText = (text: string): boolean => {
  const rtlRegex =
    /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const rtlChars = (text.match(rtlRegex) || []).length;
  const totalChars = text.replace(/\s/g, "").length;
  return rtlChars ? true : false; // If more than 10% RTL characters
};

export default useIsRTLText;
