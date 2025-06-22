import UIKit
import Instructions

class MainViewController: UIViewController, UITextFieldDelegate, CoachMarksControllerDataSource, CoachMarksControllerDelegate {
    
    let coachMarksController = CoachMarksController()
    
    @IBOutlet weak var inputTextField: UITextField!
    @IBOutlet weak var fontSizeSlider: UISlider!
    @IBOutlet weak var speedSlider: UISlider!
    @IBOutlet weak var fontSizeLabel: UILabel!
    @IBOutlet weak var speedLabel: UILabel!
    
    @IBOutlet weak var BMDoHyeonView: UIView!
    @IBOutlet weak var BMJUAView: UIView!
    @IBOutlet weak var BMYEONSUNGView: UIView!
    
    @IBOutlet weak var collectionView: UICollectionView!
    
    @IBOutlet weak var fontViewStackView: UIStackView!
    @IBOutlet weak var startButton: UIButton!
    
    var selectedColors: [UIColor] = []
    let colors: [UIColor] = [.white, .black, .red, .orange, .yellow, .green, .blue, .magenta,
                             .systemCyan, .systemIndigo]
    let feedbackGenerator = UIImpactFeedbackGenerator(style: .light)
    var selectedFontView: UIView?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.coachMarksController.dataSource = self
        
        fontSizeLabel.text = "\(Int(fontSizeSlider.value))"
        speedLabel.text = "\(Int(speedSlider.value))"
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        view.addGestureRecognizer(tap)
        
        self.navigationItem.backBarButtonItem = UIBarButtonItem(title: "", style: .plain, target: nil, action: nil)
        
        inputTextField.layer.borderWidth = 3.0
        inputTextField.layer.borderColor = UIColor.systemBlue.cgColor
        inputTextField.layer.cornerRadius = 10.0
        
        let paddingView = UIView(frame: CGRect(x: 0, y: 0, width: 10, height: inputTextField.frame.height))
        inputTextField.leftView = paddingView
        inputTextField.leftViewMode = .always
        
        inputTextField.delegate = self
        
        collectionView.delegate = self
        collectionView.dataSource = self
        
        setupAppearanceToggle()
        
        setupFontViews()
        
        let infoButton = UIBarButtonItem(image: UIImage(systemName: "info.circle"), style: .plain, target: self, action: #selector(showCoachMarks))
        infoButton.tintColor = UIColor.gray
        self.navigationItem.leftBarButtonItem = infoButton
    }
    
    @objc func showCoachMarks() {
        self.coachMarksController.start(in: .window(over: self))
    }
    
    // 중간 생략
    
    func configureFontView(_ view: UIView, withTitle title: String, andFont fontName: String) {
        let label = UILabel()
        label.text = title
        label.font = UIFont(name: fontName, size: 25)
        label.textAlignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false

        view.addSubview(label)
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])

        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(viewTapped))
        view.addGestureRecognizer(tapGesture)
    }
    
    @objc func viewTapped(tapGesture: UITapGestureRecognizer) {
        guard let tappedView = tapGesture.view else { return }

        feedbackGenerator.impactOccurred()
        
        if tappedView == selectedFontView {
            tappedView.layer.borderColor = UIColor.systemBlue.cgColor
            tappedView.layer.borderWidth = 2.0
            selectedFontView = nil
        } else {
            [BMDoHyeonView, BMJUAView, BMYEONSUNGView].forEach {
                $0?.layer.borderColor = UIColor.systemBlue.cgColor
                $0?.layer.borderWidth = 2.0
            }
            tappedView.layer.borderColor = UIColor.green.cgColor
            tappedView.layer.borderWidth = 3.0
            selectedFontView = tappedView
        }
    }
    
    func setupAppearanceToggle() {
        let appearanceSwitch = UISwitch()
        appearanceSwitch.onTintColor = UIColor.blue
        appearanceSwitch.isOn = (traitCollection.userInterfaceStyle == .dark)
        appearanceSwitch.addTarget(self, action: #selector(appearanceToggleChanged(_:)), for: .valueChanged)
 
        let iconName = appearanceSwitch.isOn ? "moon.fill" : "sun.max.fill"
        let modeIcon = UIImage(systemName: iconName)
        let modeBarButtonItem = UIBarButtonItem(image: modeIcon, style: .plain, target: nil, action: nil)
        modeBarButtonItem.tintColor = .gray
        
        let switchBarItem = UIBarButtonItem(customView: appearanceSwitch)

        navigationItem.rightBarButtonItems = [switchBarItem, modeBarButtonItem]
    }
    
    // 중간 생략

    @IBAction func emojiButtonTapped(_ sender: UIButton) {
        guard let emoji = sender.titleLabel?.text else { return }
        inputTextField.text?.append(emoji)
        feedbackGenerator.impactOccurred()
    }
    
    @IBAction func fontSizeSliderChanged(_ sender: UISlider) {
        fontSizeLabel.text = "\(Int(sender.value))"
    }
    
    @IBAction func speedSliderChanged(_ sender: UISlider) {
        speedLabel.text = "\(Int(sender.value))"
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "showScrollingText" {
            guard let destinationVC = segue.destination as? ScrollingTextViewController else {
                return
            }
            
            if let text = inputTextField.text, !text.trimmingCharacters(in: .whitespaces).isEmpty {
                destinationVC.textToDisplay = text
                destinationVC.inputFontSize = CGFloat(fontSizeSlider.value)
                destinationVC.scrollSpeed = Double(speedSlider.value)
                destinationVC.colors = selectedColors
                
                if selectedFontView == BMDoHyeonView {
                    destinationVC.selectedFontName = "BMDoHyeon-OTF"
                } else if selectedFontView == BMJUAView {
                    destinationVC.selectedFontName = "BMJUAOTF"
                } else if selectedFontView == BMYEONSUNGView {
                    destinationVC.selectedFontName = "BMYEONSUNG-OTF"
                } else {}
            } else {
                showMessage("응원의 메시지가 비어있어요!")
            }
        }
    }

    func showMessage(_ message: String) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        let okAction = UIAlertAction(title: "확인", style: .default) { [weak self] _ in
            self?.inputTextField.becomeFirstResponder()
        }
        alert.addAction(okAction)
        present(alert, animated: true)
    }
    
    @IBAction func showLEDText(_ sender: UIButton) {
        feedbackGenerator.impactOccurred()
    }
}

extension MainViewController: UICollectionViewDataSource, UICollectionViewDelegate {
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return colors.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "ColorCell", for: indexPath) as! ColorCell
        let color = colors[indexPath.item]
        cell.colorButton.backgroundColor = color
        cell.colorButton.tag = indexPath.item
        cell.colorButton.addTarget(self, action: #selector(colorButtonTapped(sender:)), for: .touchUpInside)
        cell.colorButton.alpha = selectedColors.contains(color) ? 0.5 : 1.0
        
        cell.colorButton.layer.borderWidth = 2.0
        cell.colorButton.layer.borderColor = UIColor.lightGray.cgColor
        return cell
    }
    
    @objc func colorButtonTapped(sender: UIButton) {
        
        feedbackGenerator.impactOccurred()
        
        let color = colors[sender.tag]
        
       // 중간 생략
        
        for i in 0..<colors.count {
            if let cell = collectionView.cellForItem(at: IndexPath(item: i, section: 0)) as? ColorCell {
                let buttonColor = colors[i]
                
                if selectedColors.contains(buttonColor) {
                    cell.colorButton.alpha = 0.5
                    cell.colorButton.layer.borderColor = UIColor.green.cgColor
                    cell.colorButton.layer.borderWidth = 4.0
                } else {
                    cell.colorButton.alpha = 1.0
                    cell.colorButton.layer.borderColor = UIColor.lightGray.cgColor
                    cell.colorButton.layer.borderWidth = 2.0
                }
            }
        }
    }
}
extension MainViewController: UICollectionViewDelegateFlowLayout {
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        let padding: CGFloat = 10
        let collectionViewSize = collectionView.bounds.width - padding
        return CGSize(width: collectionViewSize/5, height: collectionViewSize/5)
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumInteritemSpacingForSectionAt section: Int) -> CGFloat {
        return 10
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumLineSpacingForSectionAt section: Int) -> CGFloat {
        return 10
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, insetForSectionAt section: Int) -> UIEdgeInsets {
        return UIEdgeInsets(top: 10, left: 10, bottom: 10, right: 10)
    }
}
