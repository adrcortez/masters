import java.awt.Color;
import java.awt.Graphics;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JPanel;


public class SpiralPanel extends JPanel {

	private static final long serialVersionUID = 5509155261502497671L;
	private List<Spiral> spirals = new ArrayList<Spiral>();
	
	public SpiralPanel() {
		super();
		
		this.setOpaque(true);
        this.setBackground(Color.WHITE);
        
		// Listen for mouse clicks
		addMouseListener(new MouseAdapter() {
            public void mouseClicked(MouseEvent e) {
                int x = e.getX();
                int y = e.getY();
                System.out.println(x + "," + y);
                
                double numTurns = SpiralPacking.numTurns;
                double width = SpiralPacking.width;
                double omega = SpiralPacking.omega;
                Point center = new Point(x, y);
                Spiral spiral = new Spiral(numTurns, width, 0.0, omega, center);
                addSpiral(spiral);
//                addChildSpiral(x, y);
            }
        });
	}
	
	public void paintComponent(Graphics g) {
        super.paintComponent(g);
        
        // Draw the spirals
        for (Spiral s : this.spirals)
        	s.paint(g);
	}
	
	public void addSpiral(Spiral s) {
		this.spirals.add(s);
		this.repaint();
	}
	
	public void addChildSpiral(double cx, double cy) {
		
		System.out.println(cx + ", " + cy);
		
		Spiral parent = null;
		double minDist = Double.MAX_VALUE;
		
		// Find the closest spiral to the specified location
		// to branch from
		for (Spiral s : this.spirals) {
			
			// Get the center of the current spiral
			double px = s.getCenter().getX();
			double py = s.getCenter().getY();
			
			// Calculate the distance to the current spiral
			double dx = cx - px;
			double dy = cy - py;
			double dist = dx*dx + dy*dy;
			
			// If this distance is less than the current minimum,
			// set this spiral as the current closest. 
			if(dist < minDist) {
				parent = s;
				minDist = dist;
			}
		}

		// TODO: Add new spiral without parent
		if(parent == null)
			return;

		// Branch from the parent spiral
		Spiral child = parent.branch(cx, cy);
		this.addSpiral(child);
		
		System.out.println(parent);
		System.out.println(child);
		System.out.println(child.getTheta());
	}
}
