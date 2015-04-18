import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;


public class SpiralPacking {
	 
	private static final int WIDTH = 800;
	private static final int HEIGHT = 600;
	
	static double numTurns = 2.5;
	static double width = 20.0;
	static int omega = 1;
		
	public static void main(String[] args) {
		JFrame frame = new JFrame("Spiral Packing");
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setSize(WIDTH, HEIGHT);
		
		// Set the frame layout
		frame.setLayout(new BorderLayout());
		
		// Component initialization
		SpiralPanel spanel = new SpiralPanel();
		frame.add(spanel, BorderLayout.CENTER);
		
		// Sweep input
		JLabel label1 = new JLabel("Sweep (T)");
		JTextField input1 = new JTextField("" + numTurns, 15);
		input1.addKeyListener(new KeyAdapter() {
            public void keyReleased(KeyEvent e) {
            	
            	// Listen for the enter key
            	char key = e.getKeyChar(); 
                if (key != KeyEvent.VK_ENTER)
                	return;
                
            	JTextField tf = (JTextField) e.getSource();
                String str = tf.getText();
                
                try {  
                	double value = Double.parseDouble(str);
                	if (value < 0.0)
                		throw new Exception();
                	numTurns = value;
                } catch(Exception ex) {  
                	JOptionPane.showMessageDialog(null, "Sweep must be a number greater than 0.");  
                }
            }
		});
		
		// Width input
		JLabel label2 = new JLabel("Width (w)");
		JTextField input2 = new JTextField("" + width, 15);
		input2.addKeyListener(new KeyAdapter() {
            public void keyReleased(KeyEvent e) {
            	
            	// Listen for the enter key
            	char key = e.getKeyChar(); 
                if (key != KeyEvent.VK_ENTER)
                	return;
                
            	JTextField tf = (JTextField) e.getSource();
                String str = tf.getText();
                
                try {  
                	double value = Double.parseDouble(str);
                	if (value < 0.0)
                		throw new Exception();
                	width = value;
                } catch(Exception ex) {  
                	JOptionPane.showMessageDialog(null, "Width must be a number greater than 0.");  
                }
            }
		});
		
		// Orientation input
		JLabel label3 = new JLabel("Orientation (\u03C9)");
		JTextField input3 = new JTextField("" + omega, 15);
		input3.addKeyListener(new KeyAdapter() {
            public void keyReleased(KeyEvent e) {
            	
            	// Listen for the enter key
            	char key = e.getKeyChar(); 
                if (key != KeyEvent.VK_ENTER)
                	return;
                
            	JTextField tf = (JTextField) e.getSource();
                String str = tf.getText();
                
                try {  
                	int value = Integer.parseInt(str);
                	if (value != 1 && value != -1)
                		throw new Exception();
                	omega = value;
                } catch(Exception ex) {  
                	JOptionPane.showMessageDialog(null, "Orientation must be either 1 or -1.");  
                }
            }
		});
		
		// The input panel
		JPanel inputs = new JPanel();
		inputs.setLayout(new GridLayout(12, 1));
		inputs.add(label1);
		inputs.add(input1);
		inputs.add(label2);
		inputs.add(input2);
		inputs.add(label3);
		inputs.add(input3);
		frame.add(inputs, BorderLayout.EAST);
		
		// Draw the seed spirals
		double theta = 30;
		double delta = (numTurns - 0.5) * width;
		double dy = delta * Math.sin(Math.toRadians(theta));
		double dx = delta * Math.cos(Math.toRadians(theta));
		
		Point center1 = new Point(WIDTH/2.0 + dx, HEIGHT/2.0 - dy);
		Spiral spiral1 = new Spiral(numTurns, width, theta - 180, -1.0, center1);
		spanel.addSpiral(spiral1);
		System.out.println("p1 = " + spiral1.getCenter());
		
		Point center2 = new Point(WIDTH/2.0 - dx, HEIGHT/2.0 + dy);
		Spiral spiral2 = new Spiral(numTurns, width, theta, -1.0, center2);
		spanel.addSpiral(spiral2);
		System.out.println("p2 = " + spiral2.getCenter());
		
		// Show the frame
		frame.setVisible(true);
	}

}
