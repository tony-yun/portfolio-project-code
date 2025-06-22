import UIKit

class ScrollingTextViewController: UIViewController {
    
    @IBOutlet weak var scrollingLabel: UILabel!
    var textToDisplay: String?
    var inputFontSize: CGFloat = 200.0
    var scrollSpeed: Double = 5.0
    var colors: [UIColor] = []
    var colorTimer: Timer?
    var selectedFontName: String?
    var isScrolling: Bool = true
    var scrollingAnimation: UIViewPropertyAnimator?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        guard let text = textToDisplay else { return }
        scrollingLabel.text = text
        if let fontName = selectedFontName {
            scrollingLabel.font = UIFont(name: fontName, size: inputFontSize)
        } else {
            scrollingLabel.font = UIFont.systemFont(ofSize: inputFontSize)  // Default iOS font
        }
        
        self.view.transform = CGAffineTransform(rotationAngle: .pi / 2)
        
        self.navigationItem.rightBarButtonItem = UIBarButtonItem(barButtonSystemItem: .pause, target: self, action: #selector(toggleScrolling))
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        // 중간 생략
        scrollingLabel.frame.origin.x = self.view.safeAreaLayoutGuide.layoutFrame.maxX
        animateScrollingText()
    }
    
    func changeColorsEverySecond() {
        colorTimer?.invalidate()
        var currentColorIndex = 0
        Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
            self.scrollingLabel.textColor = self.colors[currentColorIndex]
            currentColorIndex = 1 - currentColorIndex
        }
    }
    
    func animateScrollingText() {
        scrollingAnimation = UIViewPropertyAnimator(duration: 30.0 / scrollSpeed, curve: .linear, animations: {
            self.scrollingLabel.frame.origin.x = self.view.safeAreaLayoutGuide.layoutFrame.minX - self.scrollingLabel.frame.width
        })

        scrollingAnimation?.addCompletion { position in
            if position == .end {
                self.scrollingLabel.frame.origin.x = self.view.safeAreaLayoutGuide.layoutFrame.maxX
                self.animateScrollingText()
            }
        }

        scrollingAnimation?.startAnimation()
    }
    
    // 중간 생략

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        colorTimer?.invalidate()
        scrollingLabel.layer.removeAllAnimations()
        scrollingAnimation?.stopAnimation(true)
    }
}
