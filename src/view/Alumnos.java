package view;

import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JList;
import javax.swing.JScrollBar;
import javax.swing.JButton;
import java.awt.Color;
import javax.swing.JLabel;
import java.awt.Font;
import javax.swing.SwingConstants;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;

public class Alumnos extends JFrame {

	private static final long serialVersionUID = 1L;
	private JPanel contentPane;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					Alumnos frame = new Alumnos();
					frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the frame.
	 */
	public Alumnos() {
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 736, 424);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JList list = new JList();
		list.setBounds(524, 50, 170, 262);
		contentPane.add(list);
		
		JScrollBar scrollBar = new JScrollBar();
		scrollBar.setBounds(693, 50, 17, 262);
		contentPane.add(scrollBar);
		
		JButton btnSalir = new JButton("Salir");
		btnSalir.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				view.Menu frame = new view.Menu();
				frame.setVisible(true);
				dispose();
			}
		});
		btnSalir.setBounds(10, 11, 97, 30);
		contentPane.add(btnSalir);
		
		JPanel panel = new JPanel();
		panel.setBackground(new Color(168, 168, 168));
		panel.setBounds(178, 50, 305, 262);
		contentPane.add(panel);
		panel.setLayout(null);
		
		JLabel lblNombre = new JLabel("NOMBRE");
		lblNombre.setVerticalAlignment(SwingConstants.TOP);
		lblNombre.setFont(new Font("Tahoma", Font.PLAIN, 21));
		lblNombre.setBounds(10, 208, 285, 43);
		panel.add(lblNombre);
		
		JLabel lblApellido = new JLabel("APELLIDOS");
		lblApellido.setVerticalAlignment(SwingConstants.TOP);
		lblApellido.setFont(new Font("Tahoma", Font.PLAIN, 21));
		lblApellido.setBounds(10, 131, 285, 66);
		panel.add(lblApellido);
		
		JLabel lblFoto = new JLabel("FOTO");
		lblFoto.setBounds(10, 11, 95, 101);
		panel.add(lblFoto);

	}
}
