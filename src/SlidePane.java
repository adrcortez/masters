import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.Timer;


public class SlidePane extends JPanel {

	private static final long serialVersionUID = -3741473592731502180L;
	private int width;
	private boolean isOpen;
	
	public SlidePane(int width) {
		this(width, true);
	}
	
	public SlidePane(int width, boolean isOpen) {
		super();
		this.setWidth(width);
		this.isOpen = isOpen;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public boolean isOpen() {
		return isOpen;
	}

	public void open() {        
        SlidePaneListener listener = new SlidePaneListener(this, true);
        Timer timer = new Timer(1, listener);
        timer.start();
	}
	
	public void close() {        
        SlidePaneListener listener = new SlidePaneListener(this, false);
        Timer timer = new Timer(1, listener);
        timer.start();
	}

	private class SlidePaneListener implements ActionListener {
		private SlidePane pane;
		private boolean opening;
		
		public SlidePaneListener(SlidePane pane, boolean opening) {
			this.pane = pane;
			this.opening = opening;
		}
		
		public void actionPerformed(ActionEvent e) {
        	
			// Determine the new 
			int paneWidth = this.pane.getWidth();
	        int parentWidth = this.pane.getParent().getWidth();
	        int paneX = this.pane.getX();
	        boolean complete = false;
	        
	        if (this.opening) {
	        	this.pane.setLocation(paneX - 1, 0);
	        	complete = (paneX - 1) <= paneWidth;
	        } else {
	        	this.pane.setLocation(paneX + 1, 0);
	        	complete = paneX >= parentWidth;
	        }
			
			if (complete) {
				this.pane.isOpen = this.opening;
				Timer timer = (Timer)e.getSource();
				timer.stop();
				System.out.println("Timer stopped");
			}
        }
	}
		
	public static void main(String[] args) {
		JFrame frame = new JFrame();
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setSize(800, 600);
		frame.setLayout(new BorderLayout());
		
		SlidePane pane = new SlidePane(200);
		pane.setBackground(Color.RED);
		pane.add(new JLabel("Test"));
		frame.add(pane, BorderLayout.EAST);
		
		JButton button = new JButton("Click");
		button.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (pane.isOpen()) pane.close();
				else pane.open();
			}
		});
		frame.add(button, BorderLayout.WEST);
		
		frame.setVisible(true);
	}
}
