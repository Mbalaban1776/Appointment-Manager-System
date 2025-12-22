import 'package:flutter/material.dart';

// Eğer HTTP paketini kullanacaksanız yorumları kaldırın ve bunları ekleyin:
// import 'dart:convert';
// import 'package:http/http.dart' as http;

class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  State<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen> {
  // 1. Veri Durumu ve Liste
  bool _isLoading = true;
  List<Map<String, String>> _appointments = [];

  // Örnek Simülasyon Verisi (Backend'den gelmesi gereken)
  final List<Map<String, String>> _sampleAppointments = [
    {
      'service': 'Check-up',
      'date': 'Tomorrow, 2:00 PM',
      'status': 'Confirmed',
      'doctor': 'Dr. Sarah Johnson',
    },
    {
      'service': 'Consultation',
      'date': 'Dec 25, 10:00 AM',
      'status': 'Pending',
      'doctor': 'Dr. Michael Chen',
    },
    {
      'service': 'Therapy',
      'date': 'Jan 15, 9:00 AM',
      'status': 'Cancelled',
      'doctor': 'Dr. Alice Brown',
    },
  ];

  @override
  void initState() {
    super.initState();
    _fetchAppointments(); // Ekran açıldığında veriyi çekmeyi başlat
  }

  // 2. Backend'den Randevuları Çekme Fonksiyonu (Yoruma Alınmış)
  Future<void> _fetchAppointments() async {
    // print('Backend\'den randevular çekiliyor...');

    // ⭐️ Backend İstek Kodu (Yoruma Alınmıştır)
    /*
    try {
      final response = await http.get(Uri.parse('API_ADRESİ/user/appointments'));
      if (response.statusCode == 200) {
        final List<dynamic> jsonList = jsonDecode(response.body);
        setState(() {
          _appointments = jsonList.map((item) => item as Map<String, String>).toList();
          _isLoading = false;
        });
      } else {
        print('Randevular çekilemedi: ${response.statusCode}');
        setState(() { _isLoading = false; });
      }
    } catch (e) {
      print('Bağlantı hatası: $e');
      setState(() { _isLoading = false; });
    }
    */

    // Simülasyon: 1 saniye sonra örnek veriyi yükle
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) {
      setState(() {
        _appointments = _sampleAppointments;
        _isLoading = false;
      });
    }
  }

  // Randevu öğesi oluşturan yardımcı widget
  Widget _buildAppointmentItem(Map<String, String> appointment) {
    Color statusColor;
    Color containerColor;

    switch (appointment['status']) {
      case 'Confirmed':
        statusColor = Colors.green;
        containerColor = Colors.green.shade50;
        break;
      case 'Pending':
        statusColor = Colors.orange;
        containerColor = Colors.orange.shade50;
        break;
      case 'Cancelled':
        statusColor = Colors.red;
        containerColor = Colors.red.shade50;
        break;
      default:
        statusColor = Colors.grey;
        containerColor = Colors.grey.shade50;
    }

    return Card(
      elevation: 1,
      margin: const EdgeInsets.symmetric(vertical: 8),
      color: containerColor,
      child: ListTile(
        leading: Icon(Icons.calendar_month, color: statusColor),
        title: Text(
          '${appointment['doctor']} (${appointment['service']})',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(appointment['date']!),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: statusColor,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            appointment['status']!,
            style: const TextStyle(color: Colors.white, fontSize: 12),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Randevularım'), centerTitle: true),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _appointments.isEmpty
          ? const Center(child: Text('Henüz planlanmış bir randevunuz yok.'))
          : ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: _appointments.length,
              itemBuilder: (context, index) {
                return _buildAppointmentItem(_appointments[index]);
              },
            ),
    );
  }
}
