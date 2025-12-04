'use client';

import { useState } from 'react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EmailService } from '@/lib/services/email.service';
import { ClimateInfoService } from '@/lib/services/climate-info.service';
import { VantaWaves } from '@/components/vanta-waves';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export default function Home() {
  const [emailForm, setEmailForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const climateInfoService = new ClimateInfoService();
  const emailService = new EmailService();
  const title = climateInfoService.getTitle();

  const slides = Array.from({ length: 6 }, (_, i) => `/assets/images/${i + 1}.png`);
  const acknowledgements = [
    '/assets/images/acknowledgements/feru.png',
    '/assets/images/acknowledgements/nereus.png',
    '/assets/images/acknowledgements/nippon.png',
    '/assets/images/acknowledgements/princeton.png',
    '/assets/images/acknowledgements/seaaroundus.png',
    '/assets/images/acknowledgements/unibern.png'
  ];

  const onLogoClick = (logo: string) => {
    if (logo === 'coru') {
      window.open('https://www.coru.ubc.ca/', '_blank');
    } else if (logo === 'nereus') {
      window.open('https://www.nereusprogram.org/', '_blank');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await emailService.sendEmail(
        emailForm.name,
        emailForm.subject,
        emailForm.email,
        emailForm.message
      );
      alert('Email sent successfully!');
      setEmailForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <div id="home" className="relative min-h-screen flex items-center bg-primary text-white pt-16">
        <VantaWaves />
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-transparent z-0" />
        <div className="container mx-auto px-8 py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl text-center md:text-left font-black">{title}</h1>
              <Link href="/map" className="btn btn-accent btn-lg block md:inline-block max-w-[200px] mx-auto md:mx-0 text-center md:text-left">
                VISIT MAP
              </Link>
              <hr className="border-color4" />
              <div className="grid grid-cols-2 gap-5 items-center">
                <div className="w-full flex items-center">
                  <Image
                    src="/assets/images/coru.png"
                    alt="Coru Logo"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto cursor-pointer hover:opacity-80 transition-opacity object-contain"
                    onClick={() => onLogoClick('coru')}
                  />
                </div>
                <div className="w-full flex items-center">
                  <Image
                    src="/assets/images/nereus-footer.svg"
                    alt="Nereus Logo"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto cursor-pointer hover:opacity-80 transition-opacity object-contain"
                    onClick={() => onLogoClick('nereus')}
                  />
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/assets/images/globe.png"
                alt="Globe"
                width={600}
                height={600}
                className="float-right opacity-50"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]">
                <Carousel
                  className="w-full group"
                  setApi={setApi}
                  plugins={[
                    Autoplay({
                      delay: 5000,
                    }),
                  ]}
                  opts={{
                    align: 'start',
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {slides.map((slide, index) => (
                      <CarouselItem key={index}>
                        <div className="relative w-full">
                          <Image
                            src={slide}
                            alt={`Carousel slide ${index + 1}`}
                            width={800}
                            height={400}
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                  <CarouselDots
                    count={slides.length}
                    currentIndex={current}
                    onDotClick={(index) => api?.scrollTo(index)}
                  />
                </Carousel>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => scrollTo('motivation')}
              className="btn btn-accent w-10 h-10"
            >
              <i className="fas fa-arrow-down"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Motivation Section */}
      <div id="motivation" className="section bg-light">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="title text-3xl mb-8">Motivation</h2>
            <div className="space-y-4 text-left">
              <p>
                Marine biodiversity and fisheries are being impacted by climate change.
                There is a need for people to know about the foreseen impacts under
                contrasting futures with different greenhouse gas emissions. Such
                knowledge can help stimulate actions to support climate mitigation and
                adaptation.
              </p>
              <p>
                The aim of this website is to provide easily-accessible platform to
                share intuitive and representative indicators of climate risks and
                future impacts on global and regional marine biodiversity and fisheries.
              </p>
              <p>
                This website is regularly being updated and expanded to provide the
                latest knowledge about the topic.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="section bg-dark-custom">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="title text-3xl mb-8">About</h2>
            <div className="space-y-4 text-left">
              <p>
                This website represents future risks and project impacts of climate
                change on global marine ecosystems and fisheries through two sets of
                indicators.
              </p>
              <p>
                The first set of indicators represent climate hazards for marine
                ecosystems. These indicators include the projected changes in the
                intensity of the major climate stressors in the ocean. These stressors
                include temperature, oxygen level, acidity (pH) and changes in net
                primary production.
              </p>
              <p>
                The second set of indicators represent the project risks and impacts on
                marine ecosystems and fisheries. Since climate stressors may interact in
                posing hazards and risks on ecosystems and fisheries, an indicator
                (multi-stressor index) is presented to represent the combined hazards of
                these climate stressors. Other indicators include changes species
                turnover (representing changes in species composition), maximum catch
                potential and changes in maximum fisheries revenues.
              </p>
              <p>
                Two future time frames (the mid- and end- of 21st century) and two
                climate change scenarios are presented to provide contrasting ocean
                futures.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="section bg-light">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="title text-3xl mb-8">Contact Us</h2>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={emailForm.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail address"
                value={emailForm.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={emailForm.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <textarea
                name="message"
                placeholder="Message"
                value={emailForm.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-accent"
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Citation Section */}
      <div id="citation" className="section bg-dark-custom">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="title text-3xl text-center mb-8">Reference Citing</h2>
            <div className="space-y-4">
              <div>
                <div className="font-bold mb-2">How to cite this website</div>
                <p>Please cite the data that are presented in this website.</p>
              </div>
              <div>
                <div className="font-bold mb-2">Marine revenue potential</div>
                <p>
                  Lam VWY, Cheung WWL, Reygondeau G, Sumaila UR. Projected change in
                  global fisheries revenues under climate change. Sci Rep. 2016;6:32607.
                </p>
              </div>
              <div>
                <div className="font-bold mb-2">Maximum catch potential</div>
                <p>
                  Cheung WWL, Reygondeau G, Frölicher TL. Large benefits to marine
                  fisheries of meeting the 1.5 C global warming target. Science (80- ).
                  2016;354(6319):1591–4.
                </p>
              </div>
              <div>
                <div className="font-bold mb-2">Multi-stress index</div>
                <p>
                  Cheung WWL, Jones MC, Reygondeau G, Frölicher TL. Opportunities for
                  climate-risk reduction through effective fisheries management. Glob
                  Chang Biol. 2018;24(11):5149–63.
                </p>
              </div>
              <div>
                <div className="font-bold mb-2">Species turnover rate</div>
                <p>
                  Jones MC, Cheung WWL. Using fuzzy logic to determine the vulnerability
                  of marine species to climate change. Glob Chang Biol.
                  2018;24(2):e719--e731.
                </p>
              </div>
              <div>
                <div className="font-bold mb-2">
                  Temperature, pH, oxygen content, net primary production
                </div>
                <p>
                  Cheung WWL, Reygondeau G, Frölicher TL. Large benefits to marine
                  fisheries of meeting the 1.5 C global warming target. Science (80- ).
                  2016;354(6319):1591–4.
                </p>
              </div>
              <div>
                <div className="font-bold mb-2">Cite this website itself as</div>
                <p>
                  Cheung, WWL and Lam, V.W.Y. Editors. 2019. Climate-Fisheries Data
                  Service. World Wide Web electronic publication. xxxx, version (02/2019).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acknowledgements Section */}
      <div id="acknowledgement" className="section bg-light">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="title text-3xl text-center mb-8">Acknowledgements</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 text-center">
              {acknowledgements.map((ack, index) => (
                <div key={index}>
                  <Image
                    src={ack}
                    alt="Logo"
                    width={200}
                    height={100}
                    className="w-4/5 mx-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-12 bg-primary text-white flex items-center justify-center">
        <div className="text-sm">
          Copyright &copy; Changing Ocean Research Unit, University of British Columbia
        </div>
      </footer>
    </div>
  );
}
