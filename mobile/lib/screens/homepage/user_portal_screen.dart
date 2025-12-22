// import 'package:flutter/material.dart';
// import '../../widgets/quick_booking_panel.dart';
// import 'profile_settings_screen.dart';
// import 'appointments_screen.dart';

// class UserPortalScreen extends StatefulWidget {
//   const UserPortalScreen({super.key});

//   @override
//   State<UserPortalScreen> createState() => _UserPortalScreenState();
// }

// class _UserPortalScreenState extends State<UserPortalScreen> {
//   // Menünün açık/kapalı durumunu tutan değişken
//   bool _isSidebarOpen = false;

//   // Menünün sabit genişliği
//   final double _sidebarWidth = 250.0;

//   // Menü öğesi oluşturan yardımcı fonksiyon
//   Widget _buildMenuItem(IconData icon, String title) {
//     return ListTile(
//       leading: Icon(icon, color: Colors.blue.shade700),
//       title: Text(title, style: const TextStyle(fontSize: 16)),
//       onTap: () {
//         print('$title tıklandı');
//         // Menüye tıklandığında sidebar'ı kapat
//         setState(() {
//           _isSidebarOpen = false;
//         });
//         // TODO: Buraya ilgili sayfaya (Book Appointment, My Appointments vb.) yönlendirme kodları gelecek.
//       },
//     );
//   }

//   // Diğer paneller için yer tutucu widget ve Navigasyon
//   Widget _buildPanel(BuildContext context, String title, Color color) {
//     // Navigasyon sadece Profile & Settings paneli için aktif olacak
//     final bool isProfilePanel = title == 'Profile & Settings';

//     return GestureDetector(
//       // Tıklama algılayıcısı eklendi
//       onTap: isProfilePanel
//           ? () {
//               // ⭐️ Profile Settings sayfasına yönlendirme
//               Navigator.push(
//                 context,
//                 MaterialPageRoute(
//                   builder: (context) => const ProfileSettingsScreen(),
//                 ),
//               );
//             }
//           : null, // Başka bir panel için şimdilik tıklama yok

//       child: Card(
//         elevation: 2,
//         shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
//         child: Container(
//           width: double.infinity,
//           padding: const EdgeInsets.all(16),
//           decoration: BoxDecoration(
//             color: color,
//             borderRadius: BorderRadius.circular(10),
//           ),
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             children: [
//               Row(
//                 mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                 children: [
//                   Text(
//                     title,
//                     style: const TextStyle(
//                       fontSize: 18,
//                       fontWeight: FontWeight.bold,
//                     ),
//                   ),
//                   if (isProfilePanel)
//                     Icon(Icons.settings, color: Colors.blue.shade700),
//                 ],
//               ),
//               if (isProfilePanel) ...[
//                 const SizedBox(height: 10),
//                 const Text(
//                   'Emma Wilson, Patient ID: #12345',
//                   style: TextStyle(color: Colors.grey),
//                 ),
//               ],
//             ],
//           ),
//         ),
//       ),
//     );
//   }

//   @override
//   Widget build(BuildContext context) {
//     // Ekranın tam genişliğini alıyoruz
//     final screenWidth = MediaQuery.of(context).size.width;

//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Appointment Management System'),

//         // Menü İkonu: Tıklandığında yan paneli açıp kapatır
//         leading: IconButton(
//           icon: const Icon(Icons.menu),
//           onPressed: () {
//             setState(() {
//               _isSidebarOpen = !_isSidebarOpen;
//             });
//           },
//         ),

//         // ⭐️ Sağ üstteki kişi ikonundan Profile Settings sayfasına yönlendirme
//         actions: [
//           IconButton(
//             icon: const Icon(Icons.person),
//             onPressed: () {
//               Navigator.push(
//                 context,
//                 MaterialPageRoute(
//                   builder: (context) => const ProfileSettingsScreen(),
//                 ),
//               );
//             },
//           ),
//         ],
//       ),

//       // ⭐️ Ana içerik: Stack kullanarak menüyü üzerine bindiriyoruz
//       body: Stack(
//         children: [
//           // 1. Ana İçerik Katmanı (KAYMAYAN VE TAM EKRAN)
//           Container(
//             width: screenWidth,
//             color: Colors.grey.shade50,
//             child: Padding(
//               padding: const EdgeInsets.all(24.0),
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   const Text(
//                     'User Portal Examples',
//                     style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
//                   ),
//                   const SizedBox(height: 20),

//                   // Panelleri içeren kaydırılabilir alan
//                   Expanded(
//                     child: SingleChildScrollView(
//                       child: Column(
//                         crossAxisAlignment: CrossAxisAlignment.stretch,
//                         children: [
//                           // Quick Booking Paneli
//                           const QuickBookingPanel(),
//                           const SizedBox(height: 20),

//                           // My Appointments Paneli
//                           _buildPanel(
//                             context,
//                             'My Appointments',
//                             Colors.green.shade50,
//                           ),
//                           const SizedBox(height: 20),

//                           // Profile & Settings Paneli (Tıklanabilir)
//                           _buildPanel(
//                             context,
//                             'Profile & Settings',
//                             Colors.orange.shade50,
//                           ),
//                           const SizedBox(height: 20),
//                         ],
//                       ),
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           ),

//           // 2. Yan Panel (Üst Üste Binen Katman - Overlay)
//           AnimatedPositioned(
//             duration: const Duration(milliseconds: 300),
//             curve: Curves.easeOut,
//             // Açık: 0.0 (Görünür), Kapalı: -250.0 (Gizli)
//             left: _isSidebarOpen ? 0.0 : -_sidebarWidth,
//             top: 0,
//             bottom: 0,
//             width: _sidebarWidth,

//             child: Container(
//               // Arka planı beyaz ve opak olacak şekilde BoxDecoration kullanıldı
//               decoration: BoxDecoration(
//                 color: Colors.white,
//                 boxShadow: [
//                   BoxShadow(
//                     color: Colors.black.withOpacity(0.15),
//                     blurRadius: 10,
//                   ),
//                 ],
//               ),
//               child: SingleChildScrollView(
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     // Logo ve Uygulama Adı
//                     const Padding(
//                       padding: EdgeInsets.all(16.0),
//                       child: Column(
//                         crossAxisAlignment: CrossAxisAlignment.start,
//                         children: [
//                           Icon(
//                             Icons.calendar_today,
//                             size: 40,
//                             color: Colors.blue,
//                           ),
//                           SizedBox(height: 8),
//                           Text(
//                             'AppointPro',
//                             style: TextStyle(
//                               fontSize: 18,
//                               fontWeight: FontWeight.bold,
//                             ),
//                           ),
//                           Text(
//                             'Management Suite',
//                             style: TextStyle(fontSize: 14, color: Colors.grey),
//                           ),
//                         ],
//                       ),
//                     ),

//                     // Menü Öğeleri Başlığı
//                     const Padding(
//                       padding: EdgeInsets.fromLTRB(16, 8, 16, 4),
//                       child: Text(
//                         'USER PORTAL',
//                         style: TextStyle(
//                           color: Colors.grey,
//                           fontWeight: FontWeight.bold,
//                           fontSize: 12,
//                         ),
//                       ),
//                     ),

//                     // Menü Öğeleri
//                     _buildMenuItem(
//                       Icons.calendar_today_outlined,
//                       'Book Appointment',
//                     ),
//                     _buildMenuItem(Icons.access_time_filled, 'My Appointments'),
//                     _buildMenuItem(
//                       Icons.person_search_outlined,
//                       'Find Providers',
//                     ),
//                     _buildMenuItem(
//                       Icons.description_outlined,
//                       'Medical Records',
//                     ),
//                   ],
//                 ),
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }


import 'package:flutter/material.dart';
import '../../widgets/quick_booking_panel.dart';
import 'profile_settings_screen.dart';
import 'appointments_screen.dart'; // ⭐️ Yeni Randevu Ekranı Importu

class UserPortalScreen extends StatefulWidget {
  const UserPortalScreen({super.key});

  @override
  State<UserPortalScreen> createState() => _UserPortalScreenState();
}

class _UserPortalScreenState extends State<UserPortalScreen> {
  // Menünün açık/kapalı durumunu tutan değişken
  bool _isSidebarOpen = false;

  // Menünün sabit genişliği
  final double _sidebarWidth = 250.0;

  // Menü öğesi oluşturan yardımcı fonksiyon
  Widget _buildMenuItem(IconData icon, String title) {
    return ListTile(
      leading: Icon(icon, color: Colors.blue.shade700),
      title: Text(title, style: const TextStyle(fontSize: 16)),
      onTap: () {
        print('$title tıklandı');

        // Menüye tıklandığında sidebar'ı kapat
        setState(() {
          _isSidebarOpen = false;
        });

        // ⭐️ Yan Menü Navigasyonu
        if (title == 'My Appointments') {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AppointmentsScreen()),
          );
        } else if (title == 'Find Providers') {
          // TODO: Diğer navigasyonlar buraya eklenebilir
        }
      },
    );
  }

  // Diğer paneller için yer tutucu widget ve Navigasyon
  Widget _buildPanel(BuildContext context, String title, Color color) {
    // Navigasyon gerektiren paneller
    final bool isProfilePanel = title == 'Profile & Settings';
    final bool isAppointmentsPanel = title == 'My Appointments';

    return GestureDetector(
      // Tıklama algılayıcısı eklendi
      onTap: isProfilePanel || isAppointmentsPanel
          ? () {
              // İlgili paneller tıklanabilir

              // Hangi sayfaya gideceğini belirle
              final Widget targetScreen = isAppointmentsPanel
                  ? const AppointmentsScreen() // Randevu ekranı
                  : const ProfileSettingsScreen(); // Profil ekranı

              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => targetScreen),
              );
            }
          : null, // Diğer paneller için tıklama yok

      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  // Profil veya Randevu panelleri için sağ üstteki ikon
                  if (isProfilePanel)
                    Icon(Icons.settings, color: Colors.blue.shade700),
                  if (isAppointmentsPanel)
                    Icon(Icons.access_time_filled, color: Colors.blue.shade700),
                ],
              ),
              if (isProfilePanel) ...[
                const SizedBox(height: 10),
                const Text(
                  'Emma Wilson, Patient ID: #12345',
                  style: TextStyle(color: Colors.grey),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Ekranın tam genişliğini alıyoruz
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Appointment Management System'),

        // Menü İkonu: Tıklandığında yan paneli açıp kapatır
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: () {
            setState(() {
              _isSidebarOpen = !_isSidebarOpen;
            });
          },
        ),

        // Sağ üstteki kişi ikonundan Profile Settings sayfasına yönlendirme
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const ProfileSettingsScreen(),
                ),
              );
            },
          ),
        ],
      ),

      // Ana içerik: Stack kullanarak menüyü üzerine bindiriyoruz (Overlay)
      body: Stack(
        children: [
          // 1. Ana İçerik Katmanı (KAYMAYAN VE TAM EKRAN)
          Container(
            width: screenWidth,
            color: Colors.grey.shade50,
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'User Portal Examples',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 20),

                  // Panelleri içeren kaydırılabilir alan
                  Expanded(
                    child: SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Quick Booking Paneli
                          const QuickBookingPanel(),
                          const SizedBox(height: 20),

                          // ⭐️ My Appointments Paneli (Tıklanabilir)
                          _buildPanel(
                            context,
                            'My Appointments',
                            Colors.green.shade50,
                          ),
                          const SizedBox(height: 20),

                          // Profile & Settings Paneli (Tıklanabilir)
                          _buildPanel(
                            context,
                            'Profile & Settings',
                            Colors.orange.shade50,
                          ),
                          const SizedBox(height: 20),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // 2. Yan Panel (Üst Üste Binen Katman - Overlay)
          AnimatedPositioned(
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOut,
            // Açık: 0.0 (Görünür), Kapalı: -250.0 (Gizli)
            left: _isSidebarOpen ? 0.0 : -_sidebarWidth,
            top: 0,
            bottom: 0,
            width: _sidebarWidth,

            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.15),
                    blurRadius: 10,
                  ),
                ],
              ),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Logo ve Uygulama Adı
                    const Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(
                            Icons.calendar_today,
                            size: 40,
                            color: Colors.blue,
                          ),
                          SizedBox(height: 8),
                          Text(
                            'AppointPro',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            'Management Suite',
                            style: TextStyle(fontSize: 14, color: Colors.grey),
                          ),
                        ],
                      ),
                    ),

                    // Menü Öğeleri Başlığı
                    const Padding(
                      padding: EdgeInsets.fromLTRB(16, 8, 16, 4),
                      child: Text(
                        'USER PORTAL',
                        style: TextStyle(
                          color: Colors.grey,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),

                    // Menü Öğeleri
                    _buildMenuItem(
                      Icons.calendar_today_outlined,
                      'Book Appointment',
                    ),
                    _buildMenuItem(
                      Icons.access_time_filled,
                      'My Appointments',
                    ), // ⭐️ Randevu Sayfasına Yönlendirme Burada
                    _buildMenuItem(
                      Icons.person_search_outlined,
                      'Find Providers',
                    ),
                    _buildMenuItem(
                      Icons.description_outlined,
                      'Medical Records',
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
