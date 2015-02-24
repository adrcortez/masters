import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.geom.GeneralPath;

public class Spiral {
	
	private static final double DELTA = Math.PI/360;
	
	private double numTurns;
	private double width;
	private double theta;
	private double omega;
	private Point center;
	
	public Spiral(double numTurns, double width) {
		this(numTurns, width, 0.0);
	}
	
	public Spiral(double numTurns, double width, double theta) {
		this(numTurns, width, theta, new Point());
	}
	
	public Spiral(double numTurns, double width, Point center) {
		this(numTurns, width, 0.0, center);
	}
	
	public Spiral(double numTurns, double width, double theta, Point center) {
		this(numTurns, width, theta, 1.0, center);
	}
	
	public Spiral(double numTurns, double width, double theta, double omega, Point center) {
		this.setNumTurns(numTurns);
		this.setWidth(width);
		this.setTheta(theta);
		this.setOmega(omega);
		this.setCenter(center);
	}

	public double getNumTurns() {
		return numTurns;
	}

	public void setNumTurns(double numTurns) {
		this.numTurns = numTurns;
	}
	
	public double getWidth() {
		return width;
	}

	public void setWidth(double width) {
		this.width = width;
	}

	public double getTheta() {
		return theta;
	}

	public void setTheta(double theta) {
		this.theta = theta;
	}
	
	public double getOmega() {
		return omega;
	}

	public void setOmega(double omega) {
		this.omega = omega;
	}
	
	public Point getCenter() {
		return center;
	}

	public void setCenter(Point center) {
		this.center = center;
	}

	public Circle getApproximateCircle() {
		double cx = this.getCenter().getX();
		double cy = this.getCenter().getY();
		double w = this.getWidth();
		double t = this.getNumTurns();
		double r = w * t * Math.PI / 2;
		
		return new Circle(r, cx, cy);
	}
	
	public GeneralPath getPath() {
		double cx = this.getCenter().getX();
		double cy = this.getCenter().getY();
        double width = this.getWidth();
        double omega = this.getOmega();        
        double sweep = this.getNumTurns();
        double theta = Math.toRadians(this.getTheta());
        
        GeneralPath path = new GeneralPath();
        path.moveTo(cx, cy);
        
        for (double t = 0.0; t <= sweep; t += Spiral.DELTA) {
        	double shift = 2 * Math.PI * omega * t;
        	double x = cx + width * t * Math.cos(theta + shift);
        	double y = cy - width * t * Math.sin(theta + shift);
        	path.lineTo(x, y);
        }
        
        return path;
	}
	
	public Spiral branch(double cx, double cy) {
		
		// The child spiral will have the same number of turns and
		// width as the parent to start
		double t = this.getNumTurns();
		double w = this.getWidth();
		
		double end = Math.toRadians(t * 360);
		double r = w * end;
		double tx = Math.cos(end) * r + cx;
		double ty = Math.sin(end) * r + cy;
		
		double px = this.getCenter().getX();
		double py = this.getCenter().getY();
		
		double dotp = (tx-cx)*(px-cx) + (ty-cy)*(py-cy);
		double magt = Math.sqrt((tx-cx)*(tx-cx) + (ty-cy)*(ty-cy));
		double magp = Math.sqrt((px-cx)*(px-cx) + (py-cy)*(py-cy));
		System.out.println(dotp);
		System.out.println(magt);
		System.out.println(magp);
		System.out.println();
		
		double gradient = Math.signum((ty-py)/(tx-px));
		System.out.println("gradient = " + gradient);
		
		// Calculate theta using the dot product and magnitudes
		double theta = Math.acos(dotp / (magt * magp));
		theta = Math.toDegrees(gradient * theta);
		System.out.println(theta);
		System.out.println();
//		// Rotate the child spiral so that the terminal point is
//		// on the line from the parent's center to the desired position.
//		double dy = center.getY() - this.getCenter().getY();
//		double dx = center.getX() - this.getCenter().getX();
//		double theta = Math.toDegrees(Math.atan2(dy, dx));
		
		// TODO: Adjust the center when needed
		Point center = new Point(cx, cy);
		
		System.out.println("p = (" + px + ", " + py + ")");
		System.out.println("c = (" + cx + ", " + cy + ")");
		System.out.println("t = (" + tx + ", " + ty + ")");
		System.out.println();
		// Return the child spiral
		return new Spiral(t, w, theta, center);
	}
	
	public void paint(Graphics g) {
		
		double cx = this.getCenter().getX();
		double cy = this.getCenter().getY();
		
		double start = Math.toRadians(this.getTheta());
        double end = Math.toRadians(this.getNumTurns() * 360) + start;
		double r = this.getWidth() * (end - start);
		double tx = Math.cos(end) * r + cx;
		double ty = Math.sin(end) * r + cy;
		
		GeneralPath path = this.getPath();
		Graphics2D graphics = (Graphics2D) g;
		graphics.draw(path);
		
//		graphics.drawString("C", (float)cx, (float)cy);
//		graphics.drawString("T", (float)tx, (float)ty);
//		graphics.draw(this.getApproximateCircle().getPath());
//		graphics.drawLine(0, (int) this.getCenter().getY(), 1000, (int) this.getCenter().getY());
	}
}
