const MyConUseModal = ({
  con,
  isVisible,
  closeModal,
  promoteUseCon,
}: MyConUseModalProps) => {
  const queryClient = useQueryClient()
  const { top: insetTop, bottom: insetBottom } = useSafeAreaInsets()

  const { updateMyConActionType } = useMyCon()

  const [isShowEnlargedImage, setIsShowEnlargedImage] = useState<boolean>(false)
  const [myConImage, setMyConImage] = useState<Nullable<string>>(null)
  const [isBackPressAndroidModalVisible, setIsBackPressAndroidModalVisible] =
    useState<boolean>(false)

  const defaultBrightnessRef = useRef<number>(0.6)
  const descriptionImageTabScrollYRef = useRef<number>(0)

  const rippleScale = useSharedValue<number>(0)
  const rippleOpacity = useSharedValue<number>(0)

  useEffect(() => {
    const backupBrightness = async () => {
      try {
        if (Platform.OS === 'ios') {
          defaultBrightnessRef.current = await getBrightnessIos()
        } else if (Platform.OS === 'android') {
          defaultBrightnessRef.current = await getBrightnessAndroid()
        }
      
        // ...
    }

    backupBrightness()
  }, [])

  useEffect(() => {
    const setBrightness = async (brightness: number) => {
      try {
        if (Platform.OS === 'ios') {
          await setBrightnessIos(brightness)
        } else if (Platform.OS === 'android') {
          await setBrightnessAndroid(brightness)
        }
      //...
    }

    if (isVisible && isBarcode && defaultBrightnessRef.current < 0.6) {
      setBrightness(0.6)

      return () => {
        setBrightness(defaultBrightnessRef.current)
      }
    }
  }, [isVisible])