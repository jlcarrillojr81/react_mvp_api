  // Function to fetch and display all events
  async function fetchEvents() {
    try {
      const response = await fetch('/events');
      const events = await response.json();

      eventsList.innerHTML = '';

      if (events.length === 0) {
        const noEventsMsg = document.createElement('p');
        noEventsMsg.textContent = 'No events found.';
        eventsList.appendChild(noEventsMsg);
      } else {
        events.forEach(event => {
          const item = createEventItem(event);
          eventsList.appendChild(item);
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Function to add a new event
  async function addEvent(event) {
    event.preventDefault();

    const formData = new FormData(addEventForm);
    const newEvent = {
      time: formData.get('time'),
      activity: formData.get('activity'),
      location: formData.get('location'),
      notes: formData.get('notes'),
      completed: false,
    };

    try {
      const response = await fetch('/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        clearForms();
        fetchEvents();
      } else {
        console.error('Error adding event');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Function to update an event
  async function updateEvent(event) {
    event.preventDefault();

    const formData = new FormData(editEventForm);
    const updatedEvent = {
      id: editEventId,
      time: formData.get('time'),
      activity: formData.get('activity'),
      location: formData.get('location'),
      notes: formData.get('notes'),
      completed: false,
    };

    try {
      const response = await fetch(`/events/${editEventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        clearForms();
        fetchEvents();
      } else {
        console.error('Error updating event');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Function to update the completion status of an event
  async function updateEventCompletion(eventId, completed) {
    const updatedEvent = { completed };

    try {
      const response = await fetch(`/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        console.error('Error updating event completion');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Function to delete an event
  async function deleteEvent(eventId) {
    try {
      const response = await fetch(`/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEvents();
      } else {
        console.error('Error deleting event');
      }
    } catch (error) {
      console.error(error);
    }
  }
