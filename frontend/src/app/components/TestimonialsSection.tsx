import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "राज कुमार",
      role: "किसान, गया",
      image: "RK",
      rating: 5,
      text: "Village Help के माध्यम से मुझे PM Kisan योजना के बारे में समय पर जानकारी मिली। बहुत उपयोगी प्लेटफॉर्म है।",
    },
    {
      name: "प्रिया शर्मा",
      role: "छात्रा, पटना",
      image: "PS",
      rating: 5,
      text: "स्कॉलरशिप और स्टडी मटेरियल के लिए यह वेबसाइट बहुत मददगार है। सभी जानकारी एक ही जगह मिल जाती है।",
    },
    {
      name: "विनोद यादव",
      role: "बेरोजगार, मुजफ्फरपुर",
      image: "VY",
      rating: 5,
      text: "रोजगार की जानकारी और सरकारी नौकरियों के नोटिफिकेशन समय पर मिल जाते हैं। बहुत अच्छी सेवा है।",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">What People Say</h2>
          <p className="text-gray-600">Trusted by thousands of rural citizens</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative backdrop-blur-xl"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-[#6DBE45]/10" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#6DBE45] to-[#2D7A1F] rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 italic" style={{ fontFamily: 'Mukta, sans-serif' }}>
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
